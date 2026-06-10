const prisma = require('../config/db');

// 1. Get Partner Stats (calculated dynamically from SQLite DB)
const getPartnerStats = async (req, res, next) => {
  try {
    const partnerId = req.user.id;
    const partnerUser = await prisma.user.findUnique({
      where: { id: partnerId }
    });

    if (!partnerUser) {
      return res.status(404).json({ error: 'Partner not found' });
    }

    // Get referral campaigns stats
    const referrals = await prisma.referral.findMany({
      where: { partnerId }
    });

    const referralCodes = referrals.map(r => r.code);
    referralCodes.push(partnerUser.email);
    referralCodes.push(partnerUser.id);

    const totalClicks = referrals.reduce((sum, r) => sum + r.clicks, 0);
    const totalSignups = referrals.reduce((sum, r) => sum + r.signups, 0);

    // Get referred client owners
    const referredUsers = await prisma.user.findMany({
      where: {
        role: 'CLIENT_OWNER',
        referralCode: { in: referralCodes }
      }
    });
    const referredUserIds = referredUsers.map(u => u.id);

    // Get client workspaces owned by referred owners
    const clients = await prisma.client.findMany({
      where: {
        ownerId: { in: referredUserIds }
      }
    });

    // Calculate personalSales based on plan price list
    const planPrices = { BASIC: 990, PRO: 4900, ADVANCED: 11900 };
    const personalSales = clients.reduce((sum, c) => sum + (planPrices[c.plan] || 990), 0);

    // Calculate rate
    const isMain = partnerUser.role === 'PARTNER_MAIN';
    let currentRate = 15;
    let nextRate = 18;
    let targetVolume = 50000;

    if (isMain) {
      if (personalSales >= 150000) {
        currentRate = 25;
        nextRate = null;
        targetVolume = 150000;
      } else if (personalSales >= 50000) {
        currentRate = 18;
        nextRate = 25;
        targetVolume = 150000;
      } else {
        currentRate = 15;
        nextRate = 18;
        targetVolume = 50000;
      }
    } else {
      // PARTNER_SUB
      if (personalSales >= 150000) {
        currentRate = 15;
        nextRate = null;
        targetVolume = 150000;
      } else if (personalSales >= 50000) {
        currentRate = 10;
        nextRate = 15;
        targetVolume = 150000;
      } else {
        currentRate = 7;
        nextRate = 10;
        targetVolume = 50000;
      }
    }

    const personalCommission = Math.floor(personalSales * (currentRate / 100));

    // Calculate teamOverrideCommission (only for PARTNER_MAIN)
    let teamOverrideCommission = 0;
    if (isMain) {
      const subPartners = await prisma.user.findMany({
        where: {
          role: 'PARTNER_SUB',
          referralCode: partnerUser.email
        }
      });

      for (const sp of subPartners) {
        const spReferrals = await prisma.referral.findMany({
          where: { partnerId: sp.id }
        });
        const spCodes = spReferrals.map(r => r.code);
        spCodes.push(sp.email);
        spCodes.push(sp.id);

        const spClients = await prisma.client.findMany({
          where: {
            owner: {
              role: 'CLIENT_OWNER',
              referralCode: { in: spCodes }
            }
          }
        });

        const spSales = spClients.reduce((sum, c) => sum + (planPrices[c.plan] || 990), 0);
        if (spSales >= 150000) {
          teamOverrideCommission += Math.floor(spSales * 0.10);
        } else if (spSales >= 50000) {
          teamOverrideCommission += Math.floor(spSales * 0.05);
        }
      }
    }

    const netIncome = personalCommission + teamOverrideCommission;

    // Sum payouts (withdrawals) from database
    const payouts = await prisma.payout.findMany({
      where: { partnerId }
    });
    const paidAmount = payouts.filter(p => p.status === 'APPROVED').reduce((sum, p) => sum + p.amount, 0);
    const pendingAmount = payouts.filter(p => p.status === 'PENDING').reduce((sum, p) => sum + p.amount, 0);

    res.json({
      personalSales,
      currentRate,
      personalCommission,
      teamOverrideCommission,
      netIncome,
      totalClicks,
      totalSignups,
      paidAmount,
      pendingAmount,
      targetVolume,
      nextRate
    });
  } catch (error) {
    next(error);
  }
};

// 2. Referrals Campaign Operations
const getReferrals = async (req, res, next) => {
  try {
    const partnerId = req.user.id;
    const referrals = await prisma.referral.findMany({
      where: { partnerId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(referrals);
  } catch (error) {
    next(error);
  }
};

const createReferralLink = async (req, res, next) => {
  try {
    const partnerId = req.user.id;
    const { name, code } = req.body;

    if (!name || !code) {
      return res.status(400).json({ error: 'Campaign name and tracking code are required.' });
    }

    // Check code uniqueness
    const existingCode = await prisma.referral.findUnique({
      where: { code }
    });

    if (existingCode) {
      return res.status(400).json({ error: 'Tracking code is already taken. Please choose another.' });
    }

    const referral = await prisma.referral.create({
      data: {
        partnerId,
        name,
        code,
        clicks: 0,
        signups: 0
      }
    });

    res.status(201).json(referral);
  } catch (error) {
    next(error);
  }
};

// 3. Sub-Partners Network Operations (derived from SQLite)
const getSubPartners = async (req, res, next) => {
  try {
    const partnerId = req.user.id;
    const partnerUser = await prisma.user.findUnique({
      where: { id: partnerId }
    });

    if (!partnerUser) {
      return res.status(404).json({ error: 'Partner not found' });
    }

    const subPartners = await prisma.user.findMany({
      where: {
        role: 'PARTNER_SUB',
        referralCode: partnerUser.email
      }
    });

    const planPrices = { BASIC: 990, PRO: 4900, ADVANCED: 11900 };
    const formatted = [];

    for (const sp of subPartners) {
      const spReferrals = await prisma.referral.findMany({
        where: { partnerId: sp.id }
      });
      const spCodes = spReferrals.map(r => r.code);
      spCodes.push(sp.email);
      spCodes.push(sp.id);

      const spClients = await prisma.client.findMany({
        where: {
          owner: {
            role: 'CLIENT_OWNER',
            referralCode: { in: spCodes }
          }
        }
      });

      const spSales = spClients.reduce((sum, c) => sum + (planPrices[c.plan] || 990), 0);

      formatted.push({
        id: sp.email, // e.g. SP99201
        name: sp.name,
        sales: spSales,
        clients: spClients.length,
        joined: sp.createdAt.toISOString().split('T')[0]
      });
    }

    res.json(formatted);
  } catch (error) {
    next(error);
  }
};

// 4. Withdrawal Request Operations
const requestPayout = async (req, res, next) => {
  try {
    const partnerId = req.user.id;
    const { amount } = req.body;

    if (!amount || parseFloat(amount) <= 0) {
      return res.status(400).json({ error: 'Invalid payout withdrawal amount.' });
    }

    const payout = await prisma.payout.create({
      data: {
        partnerId,
        amount: parseFloat(amount),
        status: 'PENDING'
      }
    });

    res.status(201).json(payout);
  } catch (error) {
    next(error);
  }
};

// 5. Get Partner Clients (dynamic 100%)
const getClients = async (req, res, next) => {
  try {
    const partnerId = req.user.id;
    const partnerUser = await prisma.user.findUnique({
      where: { id: partnerId }
    });

    if (!partnerUser) {
      return res.status(404).json({ error: 'Partner not found' });
    }

    const planPrices = { BASIC: 990, PRO: 4900, ADVANCED: 11900 };

    // Get partner referral codes
    const referrals = await prisma.referral.findMany({
      where: { partnerId }
    });
    const referralCodes = referrals.map(r => r.code);
    referralCodes.push(partnerUser.email);
    referralCodes.push(partnerUser.id);

    // Get direct referred clients
    const directClients = await prisma.client.findMany({
      where: {
        owner: {
          role: 'CLIENT_OWNER',
          referralCode: { in: referralCodes }
        }
      },
      include: { owner: true }
    });

    const formatted = directClients.map(c => ({
      id: c.id,
      name: c.name,
      plan: c.plan.charAt(0) + c.plan.slice(1).toLowerCase(),
      ltv: planPrices[c.plan] || 990,
      source: 'Direct',
      status: c.status === 'ACTIVE' ? 'Active' : 'Pending',
      expiresIn: 45
    }));

    // If main partner, also fetch sub partner referred clients
    if (partnerUser.role === 'PARTNER_MAIN') {
      const subPartners = await prisma.user.findMany({
        where: {
          role: 'PARTNER_SUB',
          referralCode: partnerUser.email
        }
      });

      for (const sp of subPartners) {
        const spReferrals = await prisma.referral.findMany({
          where: { partnerId: sp.id }
        });
        const spCodes = spReferrals.map(r => r.code);
        spCodes.push(sp.email);
        spCodes.push(sp.id);

        const subClients = await prisma.client.findMany({
          where: {
            owner: {
              role: 'CLIENT_OWNER',
              referralCode: { in: spCodes }
            }
          },
          include: { owner: true }
        });

        subClients.forEach(c => {
          formatted.push({
            id: c.id,
            name: c.name,
            plan: c.plan.charAt(0) + c.plan.slice(1).toLowerCase(),
            ltv: planPrices[c.plan] || 990,
            source: sp.email,
            status: c.status === 'ACTIVE' ? 'Active' : 'Pending',
            expiresIn: 45
          });
        });
      }
    }

    res.json(formatted);
  } catch (error) {
    next(error);
  }
};

// 6. Get Partner Payouts History (new method)
const getPayouts = async (req, res, next) => {
  try {
    const partnerId = req.user.id;
    const partnerUser = await prisma.user.findUnique({
      where: { id: partnerId }
    });

    if (!partnerUser) {
      return res.status(404).json({ error: 'Partner not found' });
    }

    const payouts = await prisma.payout.findMany({
      where: { partnerId },
      orderBy: { requestedAt: 'desc' }
    });

    const isMain = partnerUser.role === 'PARTNER_MAIN';
    const currentRate = isMain ? 18 : 10; // tier estimation rate for calculations

    const formatted = payouts.map(p => {
      const amount = p.amount;
      const commission = Math.floor(amount / 0.97); // estimate before 3% tax
      const tax = commission - amount;
      const sales = Math.floor(commission / (currentRate / 100)); // estimate base sales
      
      const requestDate = new Date(p.requestedAt);
      const months = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
      const billPeriod = `${months[requestDate.getMonth()]} ${requestDate.getFullYear() + 543}`;
      
      return {
        id: p.id,
        period: billPeriod,
        sales: sales,
        commission: commission,
        tax: tax,
        net: amount,
        status: p.status === 'APPROVED' ? 'Paid' : (p.status === 'REJECTED' ? 'Rejected' : 'Pending')
      };
    });

    res.json(formatted);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPartnerStats,
  getReferrals,
  createReferralLink,
  getSubPartners,
  requestPayout,
  getClients,
  getPayouts
};

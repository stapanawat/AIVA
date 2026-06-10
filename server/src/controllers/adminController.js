const prisma = require('../config/db');

// 1. Partner Management
const getPartners = async (req, res, next) => {
  try {
    // Retrieve all users who are partners
    const partners = await prisma.user.findMany({
      where: {
        role: {
          in: ['PARTNER_MAIN', 'PARTNER_SUB']
        }
      },
      include: {
        referrals: true
      }
    });

    const planPrices = { BASIC: 990, PRO: 4900, ADVANCED: 11900 };
    const formatted = [];

    for (const p of partners) {
      // Find referral codes
      const referralCodes = p.referrals.map(r => r.code);
      referralCodes.push(p.email);
      referralCodes.push(p.id);

      // Find referred owners
      const referredUsers = await prisma.user.findMany({
        where: {
          role: 'CLIENT_OWNER',
          referralCode: { in: referralCodes }
        }
      });
      const referredUserIds = referredUsers.map(u => u.id);

      // Get client workspaces
      const clients = await prisma.client.findMany({
        where: {
          ownerId: { in: referredUserIds }
        }
      });

      const rev = clients.reduce((sum, c) => sum + (planPrices[c.plan] || 990), 0);
      const clientCount = clients.length;

      // Tier text calculation
      const isMain = p.role === 'PARTNER_MAIN';
      let tier = '';
      if (isMain) {
        if (rev >= 150000) tier = 'Gold (25%)';
        else if (rev >= 50000) tier = 'Silver (18%)';
        else tier = 'Bronze (15%)';
      } else {
        if (rev >= 150000) tier = 'Gold (15%)';
        else if (rev >= 50000) tier = 'Silver (10%)';
        else tier = 'Bronze (7%)';
      }

      formatted.push({
        id: p.id,
        name: p.name,
        email: p.email,
        phone: p.phone,
        type: 'บุคคลธรรมดา',
        tier: tier,
        rev: rev,
        clients: clientCount,
        kyc: p.status === 'ACTIVE' ? 'Approved' : 'Pending',
        createdAt: p.createdAt
      });
    }

    res.json(formatted);
  } catch (error) {
    next(error);
  }
};

const updatePartnerKyc = async (req, res, next) => {
  try {
    const partnerId = req.params.id;
    const { status } = req.body; // 'Approved' or 'Rejected'

    if (!status || !['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid KYC status.' });
    }

    const userStatus = status === 'Approved' ? 'ACTIVE' : 'SUSPENDED';

    const updatedUser = await prisma.user.update({
      where: { id: partnerId },
      data: {
        status: userStatus,
        updatedAt: new Date()
      }
    });

    res.json({
      message: `KYC document has been successfully ${status.toLowerCase()}.`,
      partner: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        status: updatedUser.status
      }
    });
  } catch (error) {
    next(error);
  }
};

// 2. Payout Management
const getPayouts = async (req, res, next) => {
  try {
    const payouts = await prisma.payout.findMany({
      orderBy: { requestedAt: 'desc' },
      include: {
        partner: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.json(payouts);
  } catch (error) {
    next(error);
  }
};

const approvePayout = async (req, res, next) => {
  try {
    const payoutId = req.params.id;
    const { action } = req.body; // 'approve' or 'reject'

    if (!action || !['approve', 'reject'].includes(action)) {
      return res.status(400).json({ error: 'Action must be approve or reject.' });
    }

    const payoutStatus = action === 'approve' ? 'APPROVED' : 'REJECTED';

    const updatedPayout = await prisma.payout.update({
      where: { id: payoutId },
      data: {
        status: payoutStatus,
        paidAt: action === 'approve' ? new Date() : null
      }
    });

    res.json({
      message: `Payout request has been successfully ${payoutStatus.toLowerCase()}.`,
      payout: updatedPayout
    });
  } catch (error) {
    next(error);
  }
};

// 3. Broadcast Announcement Operations
const createAnnouncement = async (req, res, next) => {
  try {
    const { title, content, targetTier } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Announcement title and content are required.' });
    }

    const announcement = await prisma.announcement.create({
      data: {
        title,
        content,
        targetTier: targetTier || 'ALL'
      }
    });

    res.status(201).json(announcement);
  } catch (error) {
    next(error);
  }
};

const getAnnouncements = async (req, res, next) => {
  try {
    const announcements = await prisma.announcement.findMany({
      orderBy: { createdAt: 'desc' }
    });
    const formatted = announcements.map(a => ({
      id: a.id,
      title: a.title,
      content: a.content,
      type: a.title.includes('แคมเปญ') || a.title.includes('Campaign') ? 'Campaign' : 'Product Update',
      target: a.targetTier === 'ALL' ? 'All Partners' : (a.targetTier === 'GOLD_ONLY' ? 'Gold Tier Only' : 'Silver & Up'),
      views: 125,
      status: 'Active',
      date: new Date(a.createdAt).toLocaleDateString('th-TH')
    }));
    res.json(formatted);
  } catch (error) {
    next(error);
  }
};

const getTickets = async (req, res, next) => {
  try {
    const feedbacks = await prisma.feedback.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        client: {
          select: {
            name: true
          }
        }
      }
    });

    const formatted = feedbacks.map(f => ({
      id: f.id,
      type: f.type,
      title: f.title,
      description: f.description,
      status: f.status,
      date: new Date(f.createdAt).toLocaleDateString('th-TH'),
      customerName: f.client?.name || 'ลูกค้าทั่วไป'
    }));

    res.json(formatted);
  } catch (error) {
    next(error);
  }
};

const getCustomers = async (req, res, next) => {
  try {
    const clients = await prisma.client.findMany({
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            referralCode: true
          }
        }
      }
    });

    const allReferrals = await prisma.referral.findMany({
      include: { partner: true }
    });

    const allPartners = await prisma.user.findMany({
      where: { role: { in: ['PARTNER_MAIN', 'PARTNER_SUB'] } }
    });

    const formatted = clients.map(c => {
      const usage = Math.floor(20 + (c.id.charCodeAt(0) % 50));
      let partnerLabel = 'DIRECT';

      const refCode = c.owner?.referralCode;
      if (refCode) {
        const matchingRef = allReferrals.find(r => r.code.toUpperCase() === refCode.toUpperCase());
        if (matchingRef) {
          partnerLabel = matchingRef.partner.email;
        } else {
          const matchingPartner = allPartners.find(p => p.email.toUpperCase() === refCode.toUpperCase() || p.id === refCode);
          if (matchingPartner) {
            partnerLabel = matchingPartner.email;
          }
        }
      }

      return {
        id: c.id,
        name: c.name,
        business: c.plan === 'ADVANCED' ? 'SME / Enterprise' : 'E-commerce Retail',
        partner: partnerLabel,
        plan: c.plan.charAt(0) + c.plan.slice(1).toLowerCase(),
        mrr: c.plan === 'BASIC' ? 990 : c.plan === 'PRO' ? 2990 : 11900,
        usage: usage,
        status: c.status === 'ACTIVE' ? 'Active' : 'Inactive',
        createdAt: c.createdAt
      };
    });

    res.json(formatted);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPartners,
  updatePartnerKyc,
  getPayouts,
  approvePayout,
  createAnnouncement,
  getAnnouncements,
  getTickets,
  getCustomers
};

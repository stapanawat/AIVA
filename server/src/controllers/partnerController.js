const prisma = require('../config/db');

// 1. Get Partner Stats
const getPartnerStats = async (req, res, next) => {
  try {
    const partnerId = req.user.id;

    // Get referral campaigns stats
    const referrals = await prisma.referral.findMany({
      where: { partnerId }
    });

    const totalClicks = referrals.reduce((sum, r) => sum + r.clicks, 0);
    const totalSignups = referrals.reduce((sum, r) => sum + r.signups, 0);

    // Sum payouts (withdrawals)
    const payouts = await prisma.payout.findMany({
      where: { partnerId }
    });
    const paidAmount = payouts.filter(p => p.status === 'APPROVED').reduce((sum, p) => sum + p.amount, 0);
    const pendingAmount = payouts.filter(p => p.status === 'PENDING').reduce((sum, p) => sum + p.amount, 0);

    res.json({
      personalSales: 125400,
      currentRate: 18,
      personalCommission: 22572,
      teamOverrideCommission: 19250,
      netIncome: 41822,
      totalClicks,
      totalSignups,
      paidAmount,
      pendingAmount,
      targetVolume: 150000,
      nextRate: 25
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

// 3. Sub-Partners Network Operations
const getSubPartners = async (req, res, next) => {
  try {
    // Sub partners are users in user table under the network (simulated here)
    // To make it simple, we retrieve users who are associated with the partner (role: PARTNER_SUB)
    // For this boilerplate, we'll return a static list based on the main partner id
    const subPartners = [
      { id: 'SP88942-1', name: 'วิไลวรรณ ใจดี', rev: 45000, clients: 12, joined: '2026-05-12' },
      { id: 'SP88942-2', name: 'นพดล มั่งคั่ง', rev: 12000, clients: 3, joined: '2026-06-01' }
    ];

    res.json(subPartners);
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

module.exports = {
  getPartnerStats,
  getReferrals,
  createReferralLink,
  getSubPartners,
  requestPayout
};

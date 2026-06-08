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
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        status: true,
        createdAt: true,
        payouts: true,
        referrals: true
      }
    });

    // Format output including total client sales and kyc (simulated based on status)
    const formatted = partners.map(p => ({
      id: p.id,
      name: p.name,
      email: p.email,
      phone: p.phone,
      type: 'บุคคลธรรมดา',
      tier: p.id === 'P88942' ? 'Gold (25%)' : 'Bronze (15%)',
      rev: p.id === 'P88942' ? 125400 : 0,
      clients: p.id === 'P88942' ? 48 : 0,
      kyc: p.status === 'ACTIVE' ? 'Approved' : 'Pending',
      createdAt: p.createdAt
    }));

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

module.exports = {
  getPartners,
  updatePartnerKyc,
  getPayouts,
  approvePayout,
  createAnnouncement
};

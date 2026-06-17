const jwt = require('jsonwebtoken');
const prisma = require('../config/db');
const config = require('../config');

// Generate Access Token (short-lived)
const generateAccessToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    clientId: user.clientId || null
  };
  
  return jwt.sign(payload, config.jwt.accessSecret, {
    expiresIn: config.jwt.accessExpiration,
  });
};

// Generate Refresh Token (long-lived) and store it in database
const generateRefreshToken = async (userId) => {
  const token = jwt.sign({ id: userId }, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiration,
  });
  
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiration
  
  await prisma.refreshToken.create({
    data: {
      token,
      userId,
      expiresAt,
    }
  });
  
  return token;
};

// Verify and rotate refresh token
const rotateRefreshToken = async (oldToken) => {
  try {
    const decoded = jwt.verify(oldToken, config.jwt.refreshSecret);
    
    // Find the token in database
    const tokenRecord = await prisma.refreshToken.findUnique({
      where: { token: oldToken }
    });
    
    if (!tokenRecord) {
      throw new Error('Refresh token not found');
    }
    
    // Check if token is revoked (indicating potential compromise/theft)
    if (tokenRecord.isRevoked || tokenRecord.expiresAt < new Date()) {
      // SECURITY COUNTERMEASURE: Revoke all tokens for this user!
      await prisma.refreshToken.updateMany({
        where: { userId: tokenRecord.userId },
        data: { isRevoked: true }
      });
      throw new Error('Refresh token compromised or expired. All sessions revoked.');
    }
    
    // Revoke the old token (mark it as used)
    await prisma.refreshToken.update({
      where: { id: tokenRecord.id },
      data: { isRevoked: true }
    });
    
    // Fetch the user information (to get their role and clientId)
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: {
        clientsOwned: {
          select: { id: true, name: true, plan: true }
        },
        teamAccess: {
          select: {
            clientId: true,
            role: true,
            client: {
              select: { name: true, plan: true }
            }
          }
        }
      }
    });
    
    if (!user || user.status === 'SUSPENDED') {
      throw new Error('User suspended or not found');
    }
    
    // Attach clientId to user object for payload
    const clientId = determineBestClientId(user);
    const userWithClient = { ...user, clientId };
    
    // Generate new pair of tokens
    const newAccessToken = generateAccessToken(userWithClient);
    const newRefreshToken = await generateRefreshToken(user.id);
    
    const workspaces = [
      ...user.clientsOwned.map(c => ({ id: c.id, name: c.name, isOwner: true, plan: c.plan, role: 'OWNER' })),
      ...user.teamAccess.map(t => ({ id: t.clientId, name: t.client?.name || 'Workspace', isOwner: false, plan: t.client?.plan, role: t.role }))
    ];
    
    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        clientId,
        workspaces
      }
    };
  } catch (error) {
    throw error;
  }
};

// Determine the best workspace/client ID based on active plan priority
const determineBestClientId = (user) => {
  if (!user) return null;
  
  const ownedClients = user.clientsOwned || [];
  const teamClients = (user.teamAccess || []).map(t => ({
    id: t.clientId,
    plan: t.client?.plan || 'NONE'
  }));
  
  const allClients = [
    ...ownedClients.map(c => ({ id: c.id, plan: c.plan || 'NONE', isOwner: true })),
    ...teamClients.map(c => ({ id: c.id, plan: c.plan || 'NONE', isOwner: false }))
  ];
  
  if (allClients.length === 0) return null;
  
  const planPriority = { 'ADVANCED': 3, 'PRO': 2, 'BASIC': 1, 'NONE': 0 };
  
  allClients.sort((a, b) => {
    const prioA = planPriority[a.plan] || 0;
    const prioB = planPriority[b.plan] || 0;
    if (prioA !== prioB) {
      return prioB - prioA; // Higher plan priority first
    }
    // If plans are the same, prefer owned client
    if (a.isOwner && !b.isOwner) return -1;
    if (!a.isOwner && b.isOwner) return 1;
    return 0;
  });
  
  return allClients[0].id;
};

// Revoke a refresh token (e.g. on logout)
const revokeRefreshToken = async (token) => {
  await prisma.refreshToken.updateMany({
    where: { token },
    data: { isRevoked: true }
  });
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  rotateRefreshToken,
  revokeRefreshToken,
  determineBestClientId
};

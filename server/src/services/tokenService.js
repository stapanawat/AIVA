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
          select: { id: true }
        },
        teamAccess: {
          select: { clientId: true }
        }
      }
    });
    
    if (!user || user.status === 'SUSPENDED') {
      throw new Error('User suspended or not found');
    }
    
    // Attach clientId to user object for payload
    const clientId = user.clientsOwned[0]?.id || user.teamAccess[0]?.clientId || null;
    const userWithClient = { ...user, clientId };
    
    // Generate new pair of tokens
    const newAccessToken = generateAccessToken(userWithClient);
    const newRefreshToken = await generateRefreshToken(user.id);
    
    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        clientId
      }
    };
  } catch (error) {
    throw error;
  }
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
  revokeRefreshToken
};

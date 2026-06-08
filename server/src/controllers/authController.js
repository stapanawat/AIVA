const bcrypt = require('bcryptjs');
const prisma = require('../config/db');
const tokenService = require('../services/tokenService');

const register = async (req, res, next) => {
  try {
    const { email, password, name, role, phone } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create User
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        role,
        phone,
      }
    });

    let clientId = null;

    // If client owner, initialize their tenant workspace (Client)
    if (role === 'CLIENT_OWNER') {
      const client = await prisma.client.create({
        data: {
          name: `${name}'s Brand`,
          ownerId: user.id,
          plan: 'BASIC',
          billingCycle: 'monthly',
        }
      });
      clientId = client.id;
      
      // Also add as Admin in team member relation
      await prisma.teamMember.create({
        data: {
          clientId: client.id,
          userId: user.id,
          role: 'ADMIN'
        }
      });
    }

    // Generate tokens
    const userWithClient = { ...user, clientId };
    const accessToken = tokenService.generateAccessToken(userWithClient);
    const refreshToken = await tokenService.generateRefreshToken(user.id);

    // Set refresh token in httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(201).json({
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        clientId
      }
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        clientsOwned: { select: { id: true } },
        teamAccess: { select: { clientId: true } }
      }
    });

    if (!user || user.status === 'SUSPENDED') {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const clientId = user.clientsOwned[0]?.id || user.teamAccess[0]?.clientId || null;
    const userWithClient = { ...user, clientId };

    // Generate tokens
    const accessToken = tokenService.generateAccessToken(userWithClient);
    const refreshToken = await tokenService.generateRefreshToken(user.id);

    // Set refresh token in httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        clientId
      }
    });
  } catch (error) {
    next(error);
  }
};

const refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token required.' });
    }

    const result = await tokenService.rotateRefreshToken(refreshToken);

    // Set new refresh token in cookie
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      accessToken: result.accessToken,
      user: result.user
    });
  } catch (error) {
    res.status(401).json({ error: error.message || 'Token refresh failed.' });
  }
};

const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (refreshToken) {
      await tokenService.revokeRefreshToken(refreshToken);
    }
    
    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out successfully.' });
  } catch (error) {
    next(error);
  }
};

const googleLogin = (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_CALLBACK_URL;
  const scope = 'profile email';
  const responseType = 'code';
  
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=${responseType}&scope=${encodeURIComponent(scope)}&access_type=offline&prompt=consent`;
  
  res.redirect(googleAuthUrl);
};

const googleCallback = async (req, res, next) => {
  try {
    const { code } = req.query;
    if (!code) {
      return res.status(400).json({ error: 'Authorization code is missing.' });
    }

    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_CALLBACK_URL;

    // Exchange code for token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: googleClientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      })
    });

    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok) {
      console.error('[Google OAuth Error]', tokenData);
      return res.status(400).json({ error: tokenData.error_description || 'Failed to exchange authorization code.' });
    }

    const { access_token } = tokenData;

    // Get user info
    const userInfoResponse = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`);
    const userInfo = await userInfoResponse.json();

    if (!userInfoResponse.ok) {
      return res.status(400).json({ error: 'Failed to retrieve Google user profile.' });
    }

    const { email, name } = userInfo;

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email },
      include: {
        clientsOwned: { select: { id: true } },
        teamAccess: { select: { clientId: true } }
      }
    });

    if (!user) {
      // Create user
      user = await prisma.user.create({
        data: {
          email,
          passwordHash: '', // Social login has no password hash
          name: name || email.split('@')[0],
          role: 'CLIENT_OWNER',
          status: 'ACTIVE'
        },
        include: {
          clientsOwned: { select: { id: true } },
          teamAccess: { select: { clientId: true } }
        }
      });

      // Create a default client workspace for this owner
      const client = await prisma.client.create({
        data: {
          name: `${user.name}'s Brand`,
          ownerId: user.id,
          plan: 'BASIC',
          billingCycle: 'monthly',
        }
      });

      await prisma.teamMember.create({
        data: {
          clientId: client.id,
          userId: user.id,
          role: 'ADMIN'
        }
      });
      
      // Reload user relationships
      user = await prisma.user.findUnique({
        where: { id: user.id },
        include: {
          clientsOwned: { select: { id: true } },
          teamAccess: { select: { clientId: true } }
        }
      });
    }

    if (user.status === 'SUSPENDED') {
      return res.status(401).json({ error: 'Your account has been suspended.' });
    }

    const clientId = user.clientsOwned[0]?.id || user.teamAccess[0]?.clientId || null;

    if (clientId) {
      const knowledgeCount = await prisma.knowledge.count({ where: { clientId } });
      if (knowledgeCount === 0) {
        await prisma.knowledge.create({
          data: {
            clientId,
            type: 'TEXT',
            title: 'ข้อมูลร้านค้า AIVA Shop',
            content: 'ร้าน AIVA Shop ขายเดรสสีแดงรุ่น Ruby ไซส์ S และ M ราคา 1,290 บาท จัดส่งฟรีทั่วประเทศ โอนเงินบัญชีกสิกรไทย 012-345-6789 ชื่อบัญชี บจก. สแปร์เอ็กซ์ ทางร้านมีนโยบายเปลี่ยนสินค้าได้ภายใน 7 วันหากไซส์ไม่พอดี โดยลูกค้าต้องส่งรูปป้ายแท็กมาเช็คกับแอดมินก่อน',
            tokens: 200,
            status: 'TRAINED'
          }
        });
      }
    }

    const userWithClient = { ...user, clientId };

    // Generate tokens
    const accessToken = tokenService.generateAccessToken(userWithClient);
    const refreshToken = await tokenService.generateRefreshToken(user.id);

    // Set refresh token in cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Redirect to frontend settings or dashboard with the access token
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const userJson = JSON.stringify({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      clientId
    });
    
    res.redirect(`${frontendUrl}?token=${accessToken}&user=${encodeURIComponent(userJson)}`);
  } catch (error) {
    next(error);
  }
};

const lineLogin = (req, res) => {
  const clientId = process.env.LINE_LOGIN_CHANNEL_ID;
  const redirectUri = process.env.LINE_LOGIN_CALLBACK_URL;
  const state = Math.random().toString(36).substring(2);
  const scope = 'profile openid email';
  
  const lineAuthUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&scope=${encodeURIComponent(scope)}`;
  
  res.redirect(lineAuthUrl);
};

const lineCallback = async (req, res, next) => {
  try {
    const { code, error } = req.query;
    if (error) {
      return res.status(400).json({ error: `LINE Login error: ${error}` });
    }
    if (!code) {
      return res.status(400).json({ error: 'Authorization code is missing.' });
    }

    const lineClientId = process.env.LINE_LOGIN_CHANNEL_ID;
    const clientSecret = process.env.LINE_LOGIN_CHANNEL_SECRET;
    const redirectUri = process.env.LINE_LOGIN_CALLBACK_URL;

    // Exchange code for token
    const tokenResponse = await fetch('https://api.line.me/oauth2/v2.1/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: lineClientId,
        client_secret: clientSecret
      })
    });

    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok) {
      console.error('[LINE OAuth Error]', tokenData);
      return res.status(400).json({ error: tokenData.error_description || 'Failed to exchange authorization code.' });
    }

    const { access_token, id_token } = tokenData;

    // Get user profile info
    const profileResponse = await fetch('https://api.line.me/v2/profile', {
      headers: { 'Authorization': `Bearer ${access_token}` }
    });
    const profileData = await profileResponse.json();

    if (!profileResponse.ok) {
      return res.status(400).json({ error: 'Failed to retrieve LINE user profile.' });
    }

    let email = `${profileData.userId}@line.me`;
    if (id_token) {
      try {
        const base64Url = id_token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        const idTokenPayload = JSON.parse(jsonPayload);
        if (idTokenPayload.email) {
          email = idTokenPayload.email;
        }
      } catch (jwtErr) {
        console.warn('[LINE JWT Decode Error]', jwtErr);
      }
    }

    const name = profileData.displayName || 'LINE User';

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email },
      include: {
        clientsOwned: { select: { id: true } },
        teamAccess: { select: { clientId: true } }
      }
    });

    if (!user) {
      // Create user
      user = await prisma.user.create({
        data: {
          email,
          passwordHash: '',
          name,
          role: 'CLIENT_OWNER',
          status: 'ACTIVE'
        },
        include: {
          clientsOwned: { select: { id: true } },
          teamAccess: { select: { clientId: true } }
        }
      });

      // Create a default client workspace for this owner
      const client = await prisma.client.create({
        data: {
          name: `${user.name}'s Brand`,
          ownerId: user.id,
          plan: 'BASIC',
          billingCycle: 'monthly',
        }
      });

      await prisma.teamMember.create({
        data: {
          clientId: client.id,
          userId: user.id,
          role: 'ADMIN'
        }
      });
      
      // Reload user relationships
      user = await prisma.user.findUnique({
        where: { id: user.id },
        include: {
          clientsOwned: { select: { id: true } },
          teamAccess: { select: { clientId: true } }
        }
      });
    }

    if (user.status === 'SUSPENDED') {
      return res.status(401).json({ error: 'Your account has been suspended.' });
    }

    const clientId = user.clientsOwned[0]?.id || user.teamAccess[0]?.clientId || null;

    if (clientId) {
      const knowledgeCount = await prisma.knowledge.count({ where: { clientId } });
      if (knowledgeCount === 0) {
        await prisma.knowledge.create({
          data: {
            clientId,
            type: 'TEXT',
            title: 'ข้อมูลร้านค้า AIVA Shop',
            content: 'ร้าน AIVA Shop ขายเดรสสีแดงรุ่น Ruby ไซส์ S และ M ราคา 1,290 บาท จัดส่งฟรีทั่วประเทศ โอนเงินบัญชีกสิกรไทย 012-345-6789 ชื่อบัญชี บจก. สแปร์เอ็กซ์ ทางร้านมีนโยบายเปลี่ยนสินค้าได้ภายใน 7 วันหากไซส์ไม่พอดี โดยลูกค้าต้องส่งรูปป้ายแท็กมาเช็คกับแอดมินก่อน',
            tokens: 200,
            status: 'TRAINED'
          }
        });
      }
    }

    const userWithClient = { ...user, clientId };

    // Generate tokens
    const accessToken = tokenService.generateAccessToken(userWithClient);
    const refreshToken = await tokenService.generateRefreshToken(user.id);

    // Set refresh token in cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Redirect to frontend settings or dashboard
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const userJson = JSON.stringify({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      clientId
    });
    
    res.redirect(`${frontendUrl}?token=${accessToken}&user=${encodeURIComponent(userJson)}`);
  } catch (error) {
    next(error);
  }
};

const facebookLogin = (req, res) => {
  const clientId = process.env.FACEBOOK_CLIENT_ID;
  const redirectUri = process.env.FACEBOOK_CALLBACK_URL;
  const state = Math.random().toString(36).substring(2);
  const scope = 'email,public_profile';
  
  const fbAuthUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&scope=${encodeURIComponent(scope)}`;
  
  res.redirect(fbAuthUrl);
};

const facebookCallback = async (req, res, next) => {
  try {
    const { code, error } = req.query;
    if (error) {
      return res.status(400).json({ error: `Facebook Login error: ${error}` });
    }
    if (!code) {
      return res.status(400).json({ error: 'Authorization code is missing.' });
    }

    const fbClientId = process.env.FACEBOOK_CLIENT_ID;
    const clientSecret = process.env.FACEBOOK_CLIENT_SECRET;
    const redirectUri = process.env.FACEBOOK_CALLBACK_URL;

    // Exchange code for token
    const tokenResponse = await fetch(`https://graph.facebook.com/v18.0/oauth/access_token?client_id=${fbClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&client_secret=${clientSecret}&code=${code}`);

    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok) {
      console.error('[Facebook OAuth Error]', tokenData);
      return res.status(400).json({ error: tokenData.error?.message || 'Failed to exchange authorization code.' });
    }

    const { access_token } = tokenData;

    // Get user profile info
    const profileResponse = await fetch(`https://graph.facebook.com/me?fields=id,name,email&access_token=${access_token}`);
    const profileData = await profileResponse.json();

    if (!profileResponse.ok) {
      return res.status(400).json({ error: 'Failed to retrieve Facebook user profile.' });
    }

    // Facebook email might be null if not verified, fallback to id-based mock email
    const email = profileData.email || `${profileData.id}@facebook.com`;
    const name = profileData.name || 'Facebook User';

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email },
      include: {
        clientsOwned: { select: { id: true } },
        teamAccess: { select: { clientId: true } }
      }
    });

    if (!user) {
      // Create user
      user = await prisma.user.create({
        data: {
          email,
          passwordHash: '',
          name,
          role: 'CLIENT_OWNER',
          status: 'ACTIVE'
        },
        include: {
          clientsOwned: { select: { id: true } },
          teamAccess: { select: { clientId: true } }
        }
      });

      // Create a default client workspace for this owner
      const client = await prisma.client.create({
        data: {
          name: `${user.name}'s Brand`,
          ownerId: user.id,
          plan: 'BASIC',
          billingCycle: 'monthly',
        }
      });

      await prisma.teamMember.create({
        data: {
          clientId: client.id,
          userId: user.id,
          role: 'ADMIN'
        }
      });
      
      // Reload user relationships
      user = await prisma.user.findUnique({
        where: { id: user.id },
        include: {
          clientsOwned: { select: { id: true } },
          teamAccess: { select: { clientId: true } }
        }
      });
    }

    if (user.status === 'SUSPENDED') {
      return res.status(401).json({ error: 'Your account has been suspended.' });
    }

    const clientId = user.clientsOwned[0]?.id || user.teamAccess[0]?.clientId || null;

    if (clientId) {
      const knowledgeCount = await prisma.knowledge.count({ where: { clientId } });
      if (knowledgeCount === 0) {
        await prisma.knowledge.create({
          data: {
            clientId,
            type: 'TEXT',
            title: 'ข้อมูลร้านค้า AIVA Shop',
            content: 'ร้าน AIVA Shop ขายเดรสสีแดงรุ่น Ruby ไซส์ S และ M ราคา 1,290 บาท จัดส่งฟรีทั่วประเทศ โอนเงินบัญชีกสิกรไทย 012-345-6789 ชื่อบัญชี บจก. สแปร์เอ็กซ์ ทางร้านมีนโยบายเปลี่ยนสินค้าได้ภายใน 7 วันหากไซส์ไม่พอดี โดยลูกค้าต้องส่งรูปป้ายแท็กมาเช็คกับแอดมินก่อน',
            tokens: 200,
            status: 'TRAINED'
          }
        });
      }
    }

    const userWithClient = { ...user, clientId };

    // Generate tokens
    const accessToken = tokenService.generateAccessToken(userWithClient);
    const refreshToken = await tokenService.generateRefreshToken(user.id);

    // Set refresh token in cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Redirect to frontend settings or dashboard
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const userJson = JSON.stringify({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      clientId
    });
    
    res.redirect(`${frontendUrl}?token=${accessToken}&user=${encodeURIComponent(userJson)}`);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  refresh,
  logout,
  googleLogin,
  googleCallback,
  lineLogin,
  lineCallback,
  facebookLogin,
  facebookCallback
};


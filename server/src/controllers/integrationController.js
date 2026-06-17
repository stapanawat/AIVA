const prisma = require('../config/db');
const jwt = require('jsonwebtoken');
const config = require('../config');

const resolveCallbackUrl = (req, platform) => {
  const protocol = req.headers['x-forwarded-proto'] || req.protocol;
  const host = req.headers['x-forwarded-host'] || req.get('host');
  const dynamicBackendUrl = `${protocol}://${host}`;
  const rawBackendUrl = process.env.BACKEND_URL || dynamicBackendUrl;
  const backendUrl = rawBackendUrl.replace(/\/+$/, '');
  return `${backendUrl}/api/client/integrations/oauth/${platform}/callback`;
};


// 1. Get integrations for current client
const getIntegrations = async (req, res, next) => {
  try {
    const clientId = req.user.clientId;
    const integrations = await prisma.integration.findMany({
      where: { clientId },
      orderBy: { updatedAt: 'desc' }
    });

    // Mask sensitive config fields before sending to frontend
    const safeIntegrations = integrations.map(item => {
      const config = { ...item.config };
      if (config.channelAccessToken) {
        config.channelAccessToken = config.channelAccessToken.substring(0, 8) + '...';
      }
      if (config.channelSecret) {
        config.channelSecret = config.channelSecret.substring(0, 4) + '...';
      }
      if (config.pageAccessToken) {
        config.pageAccessToken = config.pageAccessToken.substring(0, 8) + '...';
      }
      return {
        ...item,
        config
      };
    });

    res.json(safeIntegrations);
  } catch (error) {
    next(error);
  }
};

// 2. Connect / Upsert an integration configuration
const connectIntegration = async (req, res, next) => {
  try {
    const clientId = req.user.clientId;
    const { platform, config } = req.body;

    if (!platform) {
      return res.status(400).json({ error: 'Platform is required.' });
    }

    const validPlatforms = ['LINE', 'FACEBOOK', 'INSTAGRAM', 'TIKTOK', 'YOUTUBE', 'LAZADA', 'WEBSITE'];
    const upperPlatform = platform.toUpperCase();

    if (!validPlatforms.includes(upperPlatform)) {
      return res.status(400).json({ error: `Invalid platform. Must be one of ${validPlatforms.join(', ')}` });
    }

    const integration = await prisma.integration.upsert({
      where: {
        clientId_platform: {
          clientId,
          platform: upperPlatform
        }
      },
      update: {
        config: config || {},
        status: 'ACTIVE',
        updatedAt: new Date()
      },
      create: {
        clientId,
        platform: upperPlatform,
        config: config || {},
        status: 'ACTIVE'
      }
    });

    res.status(200).json({
      message: 'Integration connected successfully!',
      integration
    });
  } catch (error) {
    next(error);
  }
};

// 3. Disconnect / delete integration
const disconnectIntegration = async (req, res, next) => {
  try {
    const clientId = req.user.clientId;
    const { platform } = req.params;

    if (!platform) {
      return res.status(400).json({ error: 'Platform parameter is required.' });
    }

    const upperPlatform = platform.toUpperCase();

    // Verify it exists for this client
    const existing = await prisma.integration.findUnique({
      where: {
        clientId_platform: {
          clientId,
          platform: upperPlatform
        }
      }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Integration not found or access denied.' });
    }

    await prisma.integration.delete({
      where: {
        clientId_platform: {
          clientId,
          platform: upperPlatform
        }
      }
    });

    res.json({ message: 'Integration disconnected successfully.' });
  } catch (error) {
    next(error);
  }
};

// 4. Start OAuth Integration
const startOAuth = async (req, res, next) => {
  try {
    const { platform } = req.params;
    const clientId = req.user.clientId;

    if (!platform) {
      return res.status(400).json({ error: 'Platform parameter is required.' });
    }

    const platformUpper = platform.toUpperCase();
    const validPlatforms = ['LINE', 'FACEBOOK', 'INSTAGRAM', 'TIKTOK', 'YOUTUBE', 'LAZADA'];

    if (!validPlatforms.includes(platformUpper)) {
      return res.status(400).json({ error: `Invalid platform. Must be one of ${validPlatforms.join(', ')}` });
    }

    // Sign the clientId and platform into the state token (expires in 15 mins)
    const state = jwt.sign({ clientId, platform: platformUpper }, config.jwt.accessSecret, { expiresIn: '15m' });

    // Check if we have real client credentials in .env
    let isSimulated = false;

    if (process.env.USE_SIMULATED_OAUTH === 'true' || req.query.simulate === 'true') {
      isSimulated = true;
    } else if (platformUpper === 'FACEBOOK' || platformUpper === 'INSTAGRAM') {
      const appId = process.env.FACEBOOK_CLIENT_ID;
      const appSecret = process.env.FACEBOOK_CLIENT_SECRET;
      if (!appId || appId.includes('YOUR_') || !appSecret || appSecret.includes('YOUR_')) {
        isSimulated = true;
      }
    } else if (platformUpper === 'LINE') {
      const loginId = process.env.LINE_LOGIN_CHANNEL_ID;
      const loginSecret = process.env.LINE_LOGIN_CHANNEL_SECRET;
      if (!loginId || loginId.includes('YOUR_') || !loginSecret || loginSecret.includes('YOUR_')) {
        isSimulated = true;
      }
    } else if (platformUpper === 'TIKTOK') {
      const appKey = process.env.TIKTOK_SHOP_APP_KEY;
      const appSecret = process.env.TIKTOK_SHOP_APP_SECRET;
      if (!appKey || appKey.includes('YOUR_') || !appSecret || appSecret.includes('YOUR_')) {
        isSimulated = true;
      }
    } else if (platformUpper === 'YOUTUBE') {
      const googleClientId = process.env.YOUTUBE_CLIENT_ID;
      const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
      if (!googleClientId || googleClientId.includes('YOUR_') || !clientSecret || clientSecret.includes('YOUR_')) {
        isSimulated = true;
      }
    } else if (platformUpper === 'LAZADA') {
      const appKey = process.env.LAZADA_APP_KEY;
      const appSecret = process.env.LAZADA_APP_SECRET;
      if (!appKey || appKey.includes('YOUR_') || !appSecret || appSecret.includes('YOUR_')) {
        isSimulated = true;
      }
    }

    if (isSimulated) {
      // Render simulated consent page
      return renderSimulatedConsent(res, platformUpper, state);
    }

    // Real OAuth redirects
    const callbackUrl = resolveCallbackUrl(req, platform);

    if (platformUpper === 'FACEBOOK' || platformUpper === 'INSTAGRAM') {
      const appId = process.env.FACEBOOK_CLIENT_ID;
      const scope = 'pages_show_list,pages_messaging,instagram_basic,instagram_manage_messages,pages_read_engagement';
      const redirectUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(callbackUrl)}&state=${state}&scope=${encodeURIComponent(scope)}`;
      return res.redirect(redirectUrl);
    } else if (platformUpper === 'LINE') {
      const channelId = process.env.LINE_LOGIN_CHANNEL_ID;
      const scope = 'profile openid email';
      const redirectUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${channelId}&redirect_uri=${encodeURIComponent(callbackUrl)}&state=${state}&scope=${encodeURIComponent(scope)}`;
      return res.redirect(redirectUrl);
    } else if (platformUpper === 'TIKTOK') {
      const appKey = process.env.TIKTOK_SHOP_APP_KEY;
      const redirectUrl = `https://services.tiktokshop.com/open/authorize?app_key=${appKey}&state=${state}`;
      return res.redirect(redirectUrl);
    } else if (platformUpper === 'YOUTUBE') {
      const googleClientId = process.env.YOUTUBE_CLIENT_ID;
      const scope = 'https://www.googleapis.com/auth/youtube.force-ssl';
      const redirectUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${encodeURIComponent(callbackUrl)}&response_type=code&state=${state}&scope=${encodeURIComponent(scope)}&access_type=offline&prompt=consent`;
      return res.redirect(redirectUrl);
    } else if (platformUpper === 'LAZADA') {
      const lazadaAppKey = process.env.LAZADA_APP_KEY;
      const redirectUrl = `https://auth.lazada.com/oauth/authorize?response_type=code&force_auth=true&redirect_uri=${encodeURIComponent(callbackUrl)}&client_id=${lazadaAppKey}&state=${state}`;
      return res.redirect(redirectUrl);
    }

    return renderSimulatedConsent(res, platformUpper, state);
  } catch (error) {
    next(error);
  }
};

// 5. Handle OAuth Callback for Integrations
const handleOAuthCallback = async (req, res, next) => {
  try {
    const { platform } = req.params;
    const { code, state, selected_pages, selected_oa, selected_shop } = req.query;

    if (!state) {
      return res.status(400).send('<h3>Error: State parameter is missing.</h3>');
    }

    let decoded;
    try {
      decoded = jwt.verify(state, config.jwt.accessSecret);
    } catch (err) {
      return res.status(403).send('<h3>Error: Invalid or expired OAuth state. Please try again.</h3>');
    }

    const { clientId, platform: statePlatform } = decoded;

    if (statePlatform !== platform.toUpperCase()) {
      return res.status(400).send('<h3>Error: Platform mismatch in state.</h3>');
    }

    const platformUpper = platform.toUpperCase();
    let integrationConfig = {};

    if (code && code.startsWith('mock_')) {
      // Mock flow values
      if (platformUpper === 'FACEBOOK') {
        const pageId = selected_pages || 'fb-page-101';
        const pageName = pageId === 'fb-page-101' ? 'GlobalTech Official' : (pageId === 'fb-page-102' ? 'AIVA Fashion Hub' : 'Mock Facebook Page');
        integrationConfig = {
          pageId,
          pageName,
          pageAccessToken: 'MOCK_PAGE_ACCESS_TOKEN_' + Math.random().toString(36).substring(2).toUpperCase(),
          connectedVia: 'Simulated OAuth'
        };
      } else if (platformUpper === 'INSTAGRAM') {
        const pageId = selected_pages || 'ig-page-101';
        const pageName = pageId === 'ig-page-101' ? 'globaltech_official' : (pageId === 'ig-page-102' ? 'aiva.fashion' : 'Mock Instagram Account');
        integrationConfig = {
          pageId,
          pageName,
          pageAccessToken: 'MOCK_IG_ACCESS_TOKEN_' + Math.random().toString(36).substring(2).toUpperCase(),
          connectedVia: 'Simulated OAuth'
        };
      } else if (platformUpper === 'LINE') {
        const oaId = selected_oa || 'line-oa-globaltech';
        const oaName = oaId === 'line-oa-globaltech' ? '@globaltech_oa' : '@aivafashion';
        integrationConfig = {
          channelId: 'mock-channel-id-' + Math.floor(Math.random() * 100000),
          channelSecret: 'mock-secret-' + Math.random().toString(36).substring(2),
          channelAccessToken: 'MOCK_LINE_ACCESS_TOKEN_' + Math.random().toString(36).substring(2).toUpperCase(),
          oaId,
          oaName,
          connectedVia: 'Simulated OAuth'
        };
      } else if (platformUpper === 'TIKTOK') {
        const shopId = selected_shop || 'tiktok-shop-1';
        const shopName = shopId === 'tiktok-shop-1' ? 'GlobalTech Store' : 'AIVA Boutique';
        integrationConfig = {
          shopId,
          shopName,
          accessToken: 'MOCK_TIKTOK_ACCESS_TOKEN_' + Math.random().toString(36).substring(2).toUpperCase(),
          refreshToken: 'MOCK_TIKTOK_REFRESH_TOKEN_' + Math.random().toString(36).substring(2).toUpperCase(),
          connectedVia: 'Simulated OAuth'
        };
      } else if (platformUpper === 'YOUTUBE') {
        const channelId = selected_pages || 'youtube-channel-1';
        const channelName = channelId === 'youtube-channel-1' ? 'GlobalTech Official' : 'AIVA Reviews';
        integrationConfig = {
          channelId,
          channelName,
          accessToken: 'MOCK_YOUTUBE_ACCESS_TOKEN_' + Math.random().toString(36).substring(2).toUpperCase(),
          connectedVia: 'Simulated OAuth'
        };
      } else if (platformUpper === 'LAZADA') {
        const shopId = selected_pages || 'lazada-shop-1';
        const shopName = shopId === 'lazada-shop-1' ? 'GlobalTech Lazada Mall' : 'AIVA Fashion Outlet';
        integrationConfig = {
          shopId,
          shopName,
          accessToken: 'MOCK_LAZADA_ACCESS_TOKEN_' + Math.random().toString(36).substring(2).toUpperCase(),
          connectedVia: 'Simulated OAuth'
        };
      }
    } else {
      // Real OAuth flow - exchange authorization code
      if (platformUpper === 'FACEBOOK') {
        const fbClientId = process.env.FACEBOOK_CLIENT_ID;
        const clientSecret = process.env.FACEBOOK_CLIENT_SECRET;
        const callbackUrl = resolveCallbackUrl(req, 'facebook');

        const tokenResponse = await fetch(`https://graph.facebook.com/v18.0/oauth/access_token?client_id=${fbClientId}&redirect_uri=${encodeURIComponent(callbackUrl)}&client_secret=${clientSecret}&code=${code}`);
        const tokenData = await tokenResponse.json();

        if (!tokenResponse.ok) {
          return res.status(400).send(`<h3>Facebook OAuth Exchange Error: ${tokenData.error?.message || 'Failed to exchange code'}</h3>`);
        }

        const userAccessToken = tokenData.access_token;
        const pagesResponse = await fetch(`https://graph.facebook.com/me/accounts?access_token=${userAccessToken}`);
        const pagesData = await pagesResponse.json();

        if (!pagesResponse.ok || !pagesData.data || pagesData.data.length === 0) {
          return res.status(400).send('<h3>Error: No Facebook pages found connected to this account.</h3>');
        }

        const primaryPage = pagesData.data[0];
        integrationConfig = {
          pageId: primaryPage.id,
          pageName: primaryPage.name,
          pageAccessToken: primaryPage.access_token,
          userAccessToken,
          connectedVia: 'OAuth 2.0'
        };
      } else if (platformUpper === 'INSTAGRAM') {
        const fbClientId = process.env.FACEBOOK_CLIENT_ID;
        const clientSecret = process.env.FACEBOOK_CLIENT_SECRET;
        const callbackUrl = resolveCallbackUrl(req, 'instagram');

        const tokenResponse = await fetch(`https://graph.facebook.com/v18.0/oauth/access_token?client_id=${fbClientId}&redirect_uri=${encodeURIComponent(callbackUrl)}&client_secret=${clientSecret}&code=${code}`);
        const tokenData = await tokenResponse.json();

        if (!tokenResponse.ok) {
          return res.status(400).send(`<h3>Instagram OAuth Exchange Error: ${tokenData.error?.message || 'Failed to exchange code'}</h3>`);
        }

        const userAccessToken = tokenData.access_token;
        const pagesResponse = await fetch(`https://graph.facebook.com/me/accounts?access_token=${userAccessToken}`);
        const pagesData = await pagesResponse.json();

        if (!pagesResponse.ok || !pagesData.data || pagesData.data.length === 0) {
          return res.status(400).send('<h3>Error: No connected Facebook pages found to discover linked Instagram account.</h3>');
        }

        let connectedIgAccount = null;
        for (const page of pagesData.data) {
          try {
            const igResponse = await fetch(`https://graph.facebook.com/v18.0/${page.id}?fields=instagram_business_account,name&access_token=${page.access_token}`);
            const igData = await igResponse.json();
            if (igData.instagram_business_account) {
              connectedIgAccount = {
                instagramBusinessAccountId: igData.instagram_business_account.id,
                pageId: page.id,
                pageName: page.name,
                pageAccessToken: page.access_token
              };
              break;
            }
          } catch (e) {
            console.error(`Error checking Instagram account for Page ${page.id}:`, e);
          }
        }

        if (!connectedIgAccount) {
          return res.status(400).send('<h3>Error: No connected Instagram Business Account found on your Facebook Pages. Please link your Instagram account to a Facebook page first.</h3>');
        }

        integrationConfig = {
          pageId: connectedIgAccount.instagramBusinessAccountId,
          pageName: `${connectedIgAccount.pageName} (Instagram)`,
          pageAccessToken: connectedIgAccount.pageAccessToken,
          fbPageId: connectedIgAccount.pageId,
          userAccessToken,
          connectedVia: 'OAuth 2.0 (Meta)'
        };
      } else if (platformUpper === 'LINE') {
        const lineClientId = process.env.LINE_LOGIN_CHANNEL_ID;
        const clientSecret = process.env.LINE_LOGIN_CHANNEL_SECRET;
        const callbackUrl = resolveCallbackUrl(req, 'line');

        const tokenResponse = await fetch('https://api.line.me/oauth2/v2.1/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            redirect_uri: callbackUrl,
            client_id: lineClientId,
            client_secret: clientSecret
          })
        });
        const tokenData = await tokenResponse.json();

        if (!tokenResponse.ok) {
          return res.status(400).send(`<h3>LINE OAuth Exchange Error: ${tokenData.error_description || 'Failed to exchange code'}</h3>`);
        }

        integrationConfig = {
          channelAccessToken: tokenData.access_token,
          connectedVia: 'OAuth 2.0'
        };
      } else if (platformUpper === 'TIKTOK') {
        const appKey = process.env.TIKTOK_SHOP_APP_KEY;
        const appSecret = process.env.TIKTOK_SHOP_APP_SECRET;

        const tokenResponse = await fetch('https://auth.tiktokshop.com/api/v1/token/get', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            app_key: appKey,
            app_secret: appSecret,
            auth_code: code,
            grant_type: 'authorized_code'
          })
        });
        const tokenData = await tokenResponse.json();

        if (tokenData.code !== 0) {
          return res.status(400).send(`<h3>TikTok Shop OAuth Error: ${tokenData.message || 'Failed to exchange code'}</h3>`);
        }

        const data = tokenData.data;
        integrationConfig = {
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          sellerId: data.seller_id,
          sellerName: data.seller_name || 'TikTok Shop Seller',
          expiresIn: data.access_token_expire_in,
          connectedVia: 'OAuth 2.0 (TikTok)'
        };
      } else if (platformUpper === 'YOUTUBE') {
        const googleClientId = process.env.YOUTUBE_CLIENT_ID;
        const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
        const callbackUrl = resolveCallbackUrl(req, 'youtube');

        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            code,
            client_id: googleClientId,
            client_secret: clientSecret,
            redirect_uri: callbackUrl,
            grant_type: 'authorization_code'
          })
        });
        const tokenData = await tokenResponse.json();

        if (!tokenResponse.ok) {
          return res.status(400).send(`<h3>YouTube OAuth Exchange Error: ${tokenData.error_description || 'Failed to exchange code'}</h3>`);
        }

        // Fetch channel info
        const channelResponse = await fetch('https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true', {
          headers: { 'Authorization': `Bearer ${tokenData.access_token}` }
        });
        const channelData = await channelResponse.json();
        const primaryChannel = channelData.items?.[0];

        integrationConfig = {
          accessToken: tokenData.access_token,
          refreshToken: tokenData.refresh_token,
          channelId: primaryChannel?.id || 'youtube-channel-id',
          channelName: primaryChannel?.snippet?.title || 'YouTube Channel',
          connectedVia: 'OAuth 2.0 (Google)'
        };
      } else if (platformUpper === 'LAZADA') {
        integrationConfig = {
          accessToken: 'MOCK_LAZADA_REAL_ACCESS_TOKEN',
          refreshToken: 'MOCK_LAZADA_REAL_REFRESH_TOKEN',
          sellerId: 'lazada-seller-id',
          sellerName: 'Lazada Shop Mall',
          connectedVia: 'OAuth 2.0 (Lazada)'
        };
      }
    }

    // Save integration in DB
    await prisma.integration.upsert({
      where: {
        clientId_platform: {
          clientId,
          platform: platformUpper
        }
      },
      update: {
        config: integrationConfig,
        status: 'ACTIVE',
        updatedAt: new Date()
      },
      create: {
        clientId,
        platform: platformUpper,
        config: integrationConfig,
        status: 'ACTIVE'
      }
    });

    // Render HTML response that notifies frontend and closes the popup
    return res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Connection Success</title>
        <link href="https://fonts.googleapis.com/css2?family=Anuphan:wght@400;600;700&display=swap" rel="stylesheet">
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          body { font-family: 'Anuphan', sans-serif; }
        </style>
      </head>
      <body class="bg-slate-50 flex flex-col items-center justify-center min-h-screen text-center p-6">
        <div class="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 max-w-md w-full">
          <div class="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 class="text-xl font-bold text-slate-800 mb-2">เชื่อมต่อสำเร็จ!</h2>
          <p class="text-sm text-slate-500 mb-6">เชื่อมต่อกับแพลตฟอร์ม ${platformUpper} สำเร็จแล้ว ระบบกำลังบันทึกข้อมูลและปิดหน้าต่างนี้โดยอัตโนมัติ...</p>
          <div class="w-8 h-8 border-4 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
        </div>
        <script>
          if (window.opener) {
            window.opener.postMessage({
              type: 'oauth-success',
              platform: '${platformUpper}'
            }, '*');
          }
          setTimeout(() => {
            window.close();
          }, 1500);
        </script>
      </body>
      </html>
    `);
  } catch (error) {
    next(error);
  }
};

// Simulated Consent Renderer helper
const renderSimulatedConsent = (res, platform, state) => {
  let bgColor = 'bg-indigo-600';
  let platformName = '';
  let logoUrl = '';
  let optionsHtml = '';

  if (platform === 'FACEBOOK') {
    bgColor = 'bg-blue-600';
    platformName = 'Facebook Messenger';
    logoUrl = 'https://play-lh.googleusercontent.com/KCMTYuiTrKom4Vyf0G4foetVOwhKWzNbHWumV73IXexAIy5TTgZipL52WTt8ICL-oIo';
    optionsHtml = `
      <div class="space-y-3 text-left">
        <label class="text-xs font-bold text-slate-500 block mb-1">เลือก Facebook Page ที่ต้องการเชื่อมต่อ:</label>
        <label class="flex items-center gap-3 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
          <input type="radio" name="selected_pages" value="fb-page-101" checked class="w-4 h-4 text-blue-600 focus:ring-blue-500">
          <div>
            <p class="text-sm font-bold text-slate-800">GlobalTech Official</p>
            <p class="text-[10px] text-slate-400">Page ID: 882939103994</p>
          </div>
        </label>
        <label class="flex items-center gap-3 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
          <input type="radio" name="selected_pages" value="fb-page-102" class="w-4 h-4 text-blue-600 focus:ring-blue-500">
          <div>
            <p class="text-sm font-bold text-slate-800">AIVA Fashion Hub</p>
            <p class="text-[10px] text-slate-400">Page ID: 104928394829</p>
          </div>
        </label>
      </div>
    `;
  } else if (platform === 'INSTAGRAM') {
    bgColor = 'bg-gradient-to-r from-purple-600 via-pink-500 to-red-500';
    platformName = 'Instagram Direct';
    logoUrl = 'https://store-images.s-microsoft.com/image/apps.43327.13510798887167234.cadff69d-8229-427b-a7da-21dbaf80bd81.79b8f512-1b22-45d6-9495-881485e3a87e';
    optionsHtml = `
      <div class="space-y-3 text-left">
        <label class="text-xs font-bold text-slate-500 block mb-1">เลือก Instagram Business Account:</label>
        <label class="flex items-center gap-3 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
          <input type="radio" name="selected_pages" value="ig-page-101" checked class="w-4 h-4 text-pink-600 focus:ring-pink-500">
          <div>
            <p class="text-sm font-bold text-slate-800">globaltech_official</p>
            <p class="text-[10px] text-slate-400">IG User ID: 19283918293</p>
          </div>
        </label>
        <label class="flex items-center gap-3 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
          <input type="radio" name="selected_pages" value="ig-page-102" class="w-4 h-4 text-pink-600 focus:ring-pink-500">
          <div>
            <p class="text-sm font-bold text-slate-800">aiva.fashion</p>
            <p class="text-[10px] text-slate-400">IG User ID: 29384928394</p>
          </div>
        </label>
      </div>
    `;
  } else if (platform === 'LINE') {
    bgColor = 'bg-[#00B900]';
    platformName = 'LINE Official Account';
    logoUrl = 'https://play-lh.googleusercontent.com/HhsyrXZLcFtoOs2_LF17yvxwDbimYaioLIhLdEO3AvZlemvM2iCzBTX27jPzd19A9vvGR-Mg3Cy9euJ22LVdgQ';
    optionsHtml = `
      <div class="space-y-3 text-left">
        <label class="text-xs font-bold text-slate-500 block mb-1">เลือก LINE Official Account (บอท):</label>
        <label class="flex items-center gap-3 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
          <input type="radio" name="selected_oa" value="line-oa-globaltech" checked class="w-4 h-4 text-emerald-600 focus:ring-emerald-500">
          <div>
            <p class="text-sm font-bold text-slate-800">@globaltech_oa</p>
            <p class="text-[10px] text-slate-400">LINE OA ID: line-oa-globaltech</p>
          </div>
        </label>
        <label class="flex items-center gap-3 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
          <input type="radio" name="selected_oa" value="line-oa-fashion" class="w-4 h-4 text-emerald-600 focus:ring-emerald-500">
          <div>
            <p class="text-sm font-bold text-slate-800">@aivafashion</p>
            <p class="text-[10px] text-slate-400">LINE OA ID: line-oa-fashion</p>
          </div>
        </label>
      </div>
    `;
  } else if (platform === 'TIKTOK') {
    bgColor = 'bg-slate-900';
    platformName = 'TikTok Shop';
    logoUrl = 'https://play-lh.googleusercontent.com/t5yNYUzJYyOzLtXXGETvuGfgQEkMdGytKr5t35WMZlva0FKgOEl7chJSrzQ848lm-jUirB2saX2rbqrIJffr=w240-h480-rw';
    optionsHtml = `
      <div class="space-y-3 text-left">
        <label class="text-xs font-bold text-slate-500 block mb-1">เลือก TikTok Shop ที่จะซิงค์ข้อมูล:</label>
        <label class="flex items-center gap-3 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
          <input type="radio" name="selected_shop" value="tiktok-shop-1" checked class="w-4 h-4 text-slate-900 focus:ring-slate-900">
          <div>
            <p class="text-sm font-bold text-slate-800">GlobalTech Store</p>
            <p class="text-[10px] text-slate-400">Seller ID: tt-seller-9001</p>
          </div>
        </label>
        <label class="flex items-center gap-3 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
          <input type="radio" name="selected_shop" value="tiktok-shop-2" class="w-4 h-4 text-slate-900 focus:ring-slate-900">
          <div>
            <p class="text-sm font-bold text-slate-800">AIVA Boutique</p>
            <p class="text-[10px] text-slate-400">Seller ID: tt-seller-9002</p>
          </div>
        </label>
      </div>
    `;
  } else if (platform === 'YOUTUBE') {
    bgColor = 'bg-[#FF0000]';
    platformName = 'YouTube Comments';
    logoUrl = 'https://play-lh.googleusercontent.com/vA1J1OI4ZGU2W6G1pA159V-vFRoTq-H1y9x45w4x1z16-vD1D1D1D1D1D1D1D1D1D1';
    optionsHtml = `
      <div class="space-y-3 text-left">
        <label class="text-xs font-bold text-slate-500 block mb-1">เลือก YouTube Channel ที่ต้องการเชื่อมต่อ:</label>
        <label class="flex items-center gap-3 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
          <input type="radio" name="selected_pages" value="youtube-channel-1" checked class="w-4 h-4 text-red-600 focus:ring-red-500">
          <div>
            <p class="text-sm font-bold text-slate-800">GlobalTech Official</p>
            <p class="text-[10px] text-slate-400">Channel ID: yt-channel-101</p>
          </div>
        </label>
        <label class="flex items-center gap-3 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
          <input type="radio" name="selected_pages" value="youtube-channel-2" class="w-4 h-4 text-red-600 focus:ring-red-500">
          <div>
            <p class="text-sm font-bold text-slate-800">AIVA Reviews</p>
            <p class="text-[10px] text-slate-400">Channel ID: yt-channel-102</p>
          </div>
        </label>
      </div>
    `;
  } else if (platform === 'LAZADA') {
    bgColor = 'bg-[#0F146D]';
    platformName = 'Lazada';
    logoUrl = 'https://laz-img-cdn.alicdn.com/tfs/TB1PApewFT7gK0jSZFpXXaTkpXa-200-200.png';
    optionsHtml = `
      <div class="space-y-3 text-left">
        <label class="text-xs font-bold text-slate-500 block mb-1">เลือก Lazada Store ที่จะเชื่อมต่อ:</label>
        <label class="flex items-center gap-3 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
          <input type="radio" name="selected_pages" value="lazada-shop-1" checked class="w-4 h-4 text-blue-600 focus:ring-blue-500">
          <div>
            <p class="text-sm font-bold text-slate-800">GlobalTech Lazada Mall</p>
            <p class="text-[10px] text-slate-400">Seller ID: laz-seller-101</p>
          </div>
        </label>
        <label class="flex items-center gap-3 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
          <input type="radio" name="selected_pages" value="lazada-shop-2" class="w-4 h-4 text-blue-600 focus:ring-blue-500">
          <div>
            <p class="text-sm font-bold text-slate-800">AIVA Fashion Outlet</p>
            <p class="text-[10px] text-slate-400">Seller ID: laz-seller-102</p>
          </div>
        </label>
      </div>
    `;
  }

  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Simulated OAuth Authorization</title>
      <link href="https://fonts.googleapis.com/css2?family=Anuphan:wght@400;500;600;700&display=swap" rel="stylesheet">
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        body { font-family: 'Anuphan', sans-serif; }
      </style>
    </head>
    <body class="bg-slate-50 flex items-center justify-center min-h-screen p-4">
      <div class="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100">
        <div class="p-6 text-white text-center relative ${bgColor}">
          <div class="absolute top-4 right-4 bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Sandbox Mode</div>
          <div class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md overflow-hidden">
            <img src="${logoUrl}" alt="${platformName}" class="w-full h-full object-cover">
          </div>
          <h2 class="text-lg font-bold">เชื่อมต่อ AIVA เข้ากับ ${platformName}</h2>
          <p class="text-xs opacity-90 mt-1">ยินยอมอนุญาตให้ AIVA อ่านข้อมูลและตอบแชทของช่องทางนี้</p>
        </div>

        <form action="/api/client/integrations/oauth/${platform.toLowerCase()}/callback" method="GET" class="p-6 space-y-6">
          <input type="hidden" name="state" value="${state}">
          <input type="hidden" name="code" value="mock_code_${Date.now()}">

          ${optionsHtml}

          <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">สิทธิ์ที่จะได้รับอนุญาต</p>
            <div class="flex items-start gap-2.5 text-xs text-slate-600">
              <svg class="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span>อ่านข้อความเข้าของเพจ/บัญชี (Read messages)</span>
            </div>
            <div class="flex items-start gap-2.5 text-xs text-slate-600">
              <svg class="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span>ตอบข้อความลูกค้าในฐานะเพจ/บอท (Send messages)</span>
            </div>
          </div>

          <div class="flex gap-3">
            <button type="button" onclick="window.close()" class="flex-1 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors font-bold text-sm text-slate-500">ยกเลิก</button>
            <button type="submit" class="flex-1 py-3 rounded-xl text-white font-bold text-sm transition-colors shadow-lg shadow-indigo-500/10 bg-indigo-600 hover:bg-indigo-700">อนุญาตสิทธิ์</button>
          </div>
        </form>
      </div>
    </body>
    </html>
  `);
};

module.exports = {
  getIntegrations,
  connectIntegration,
  disconnectIntegration,
  startOAuth,
  handleOAuthCallback
};

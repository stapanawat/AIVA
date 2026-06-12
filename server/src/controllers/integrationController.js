const prisma = require('../config/db');

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

module.exports = {
  getIntegrations,
  connectIntegration,
  disconnectIntegration
};

const path = require('path');
const dotenv = require('dotenv');

// 1. Determine which env file to load
const nodeEnv = process.env.NODE_ENV || 'development';
let envFileName = '.env.local';

if (nodeEnv === 'production') {
  envFileName = '.env.production';
} else if (nodeEnv === 'test' || nodeEnv === 'staging') {
  envFileName = '.env.production.test';
}

// 2. Load environment variables from specific file
dotenv.config({ path: path.resolve(__dirname, '../../', envFileName) });

console.log(`[AIVA Server] Loaded environment variables from: ${envFileName}`);

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: nodeEnv,
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'default_access_secret_key_123',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'default_refresh_secret_key_123',
    accessExpiration: process.env.JWT_ACCESS_EXPIRATION || '15m',
    refreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '7d',
  }
};


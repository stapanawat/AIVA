const app = require('./app');
const config = require('./config');

const server = app.listen(config.port, () => {
  console.log(`[AIVA Server] Secure server running in [${config.nodeEnv}] mode on port ${config.port}`);
});

// Handle unhandled promise rejections & uncaught exceptions
process.on('unhandledRejection', (err) => {
  console.error('[Unhandled Rejection Alert]:', err);
});

process.on('uncaughtException', (err) => {
  console.error('[Uncaught Exception Alert]:', err);
});

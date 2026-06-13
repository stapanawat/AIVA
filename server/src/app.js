const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const path = require('path');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Security Headers (helmet) - disable ContentSecurityPolicy to allow static resources to run cleanly
app.use(helmet({
  contentSecurityPolicy: false
}));

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsers with size limit protection against Denial of Service (DoS)
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf) => {
    if (req.originalUrl && req.originalUrl.startsWith('/api/payments/webhook')) {
      req.rawBody = buf;
    }
  }
}));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser for secure httpOnly Refresh Tokens
app.use(cookieParser());

// Serve local uploaded files as static resources
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

// API Routing
app.use('/api', routes);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../dist')));
  
  app.get('/*splat', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../dist', 'index.html'));
  });
} else {
  // 404 Route handler
  app.use((req, res, next) => {
    res.status(404).json({ error: 'Endpoint not found.' });
  });
}

// Global Error Handler
app.use(errorHandler);

module.exports = app;

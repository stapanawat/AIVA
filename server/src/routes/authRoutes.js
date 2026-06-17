const express = require('express');
const authController = require('../controllers/authController');
const { loginRules, registerRules } = require('../middlewares/validate');
const authenticate = require('../middlewares/auth');

const router = express.Router();

router.post('/register', registerRules, authController.register);
router.post('/login', loginRules, authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);
router.post('/switch-workspace', authenticate, authController.switchWorkspace);
router.post('/referral/click', authController.trackReferralClick);
router.post('/send-verification', authController.sendVerificationCode);
router.post('/verify-code', authController.verifyCode);

// Google OAuth 2.0 routes
router.get('/google', authController.googleLogin);
router.get('/google/callback', authController.googleCallback);

// LINE Login routes
router.get('/line', authController.lineLogin);
router.get('/line/callback', authController.lineCallback);

// Facebook Login routes
router.get('/facebook', authController.facebookLogin);
router.get('/facebook/callback', authController.facebookCallback);

module.exports = router;

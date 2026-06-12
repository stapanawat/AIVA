const express = require('express');
const authController = require('../controllers/authController');
const { loginRules, registerRules } = require('../middlewares/validate');

const router = express.Router();

router.post('/register', registerRules, authController.register);
router.post('/login', loginRules, authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);
router.post('/referral/click', authController.trackReferralClick);

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

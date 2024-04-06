const express = require('express');
const passport = require('passport');
const authController = require('../controllers/authController');

const router = express.Router();

// Google OAuth authentication route
router.get('/auth/google', authController.googleAuth);

// Google OAuth callback route
router.get('/auth/google/callback', authController.googleAuthCallback, authController.sendToken);

// Logout route
router.get('/logout', authController.logout);

module.exports = router;

const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendToken, protectRoute } = require('../controllers/authController');
const router = express.Router();

// Google OAuth callback route
router.get('/auth/google/callback', passport.authenticate('google', { session: false }), sendToken);

router.get('/admin-resource', protectRoute, (req, res) => {
  // Access user information from req.user
  const userId = req.user._id;
  // Perform actions for the admin resource
  res.json({ message: 'This is an admin resource', userId });
});
const express = require("express");
const passport = require("passport");
const authController = require("../controllers/authController");
const router = express.Router();

// Google OAuth callback route
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  authController.sendToken
);

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

module.exports = router;

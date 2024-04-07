const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const GoogleStrategy = require("passport-google-oauth20").Strategy;


// Configure Passport with Google OAuth strategy
passport.use(
  new GoogleStrategy(
    {
      clientID:process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/v1/users/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists in the database
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          // If user already exists, return the user
          return done(null, user);
        } else {
          // If user doesn't exist, create a new user with default role 'Member'
          user = await User.create({
            googleId: profile.id,
            displayName: profile.displayName,
            email: profile.emails[0].value,
            role: "Member",
          });
          return done(null, user);
        }
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Generate and send JWT token upon successful authentication
exports.sendToken = (req, res) => {
  try {
    // Generate JWT token
    const token = jwt.sign(
      { userId: req.user._id, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    ); // Include user role in the token payload

    // Send the token as a response
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Verify and decode JWT token
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
};

exports.protectRoute = (req, res, next) => {
  // Get token from request headers
  const token = req.headers.authorization;

  // Check if token exists
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  // Verify and decode the token
  const decoded = verifyToken(token.replace("Bearer ", ""));

  // Check if token is valid
  if (!decoded) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }

  // Add user ID and role to request object
  req.userId = decoded.userId;
  req.userRole = decoded.role;

  // Proceed to the next middleware or route handler
  next();
};

// Protect routes based on user roles
exports.restrictToAdmin = (req, res, next) => {
  if (req.userRole !== "Admin") {
    return res
      .status(403)
      .json({ message: "Forbidden: Insufficient permissions" });
  }
  next();
};


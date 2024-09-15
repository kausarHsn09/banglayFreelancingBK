const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { body, validationResult } = require("express-validator");

const singToken = (id, role) => {
  const token = jwt.sign(
    { userId: id, userRole: role },
    process.env.JWT_SECRET,
    {
      expiresIn: "90d",
    }
  );
  return token;
};
const createSendToken = (user, statusCode, res) => {
  const token = singToken(user._id, user.role);
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

const generateUniqueUsername = async (baseName) => {
  let username = baseName;
  let suffix = 0;
  let isUnique = false;
  while (!isUnique) {
    if (suffix > 0) {
      username = `${baseName}${suffix}`;
    }
    const existingUser = await User.findOne({ username });
    if (!existingUser) {
      isUnique = true;
    } else {
      suffix++;
    }
  }

  return username;
};

// Validation middleware
const validateSignup = [
   body("name")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Name is required.")
    .matches(/^[A-Za-z\u0980-\u09FF ]+$/)
    .withMessage("দয়া করে বাংলা বা ইংরেজি নাম লেখুন")
    .custom(value => {
      const words = value.split(' ').filter(Boolean); // Split by spaces and remove empty strings
      if (words.length > 3) {
        throw new Error("তিন শব্দের মধ্যে নাম লিখুন.");
      }
      return true;
    }),
  body("phone")
    .trim()
    .isLength({ min: 11, max: 11 })
    .withMessage("১১ সংখ্যার সঠিক ফোন নাম্বার লিখুন"),
  body("password")
    .isLength({ min: 6,max: 32 })
    .withMessage("কমপক্ষে ৬ সংখ্যার পাসওয়ার্ড লিখুন.")
];

exports.signup = [
  validateSignup,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, phone, password } = req.body;

      const existingUser = await User.findOne({ phone });
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "ইতিমধ্যে মোবাইল নাম্বারটি ব্যবহার করা হয়েছে" });
      }

      const username = await generateUniqueUsername(name.replace(/\s+/g, ""));
      const referraCodeSignature= 'tm'+username
      const newUser = new User({ name, phone, password, username,referralCode:referraCodeSignature });
      await newUser.save();
      createSendToken(newUser, 201, res);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
];

const validateLogin = [
  body("phone")
    .trim()
    .isLength({ min: 11, max: 11 })
    .withMessage("১১ সংখ্যার সঠিক ফোন নাম্বার লিখুন"),
  body("password").exists().withMessage("পাসওয়ার্ড দিন"),
];
// Controller function for user login// Login function
exports.login = [
  validateLogin,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { phone, password } = req.body;
      const user = await User.findOne({ phone });
      if (!user) {
        return res
          .status(401)
          .json({ message: "Invalid mobile number or password" });
      }

      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res
          .status(401)
          .json({ message: "Invalid mobile number or password" });
      }
      createSendToken(user, 200, res);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
];

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
  let token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }
  const decoded = verifyToken(token.replace("Bearer ", ""));
  if (!decoded) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
  req.userId = decoded.userId;
  req.userRole = decoded.userRole;
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

exports.restrictToPaidUsers = async (req, res, next) => {
    // Assuming userID is set on the request object by your authentication middleware
    const user = await User.findById(req.userId);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    if (user.userType !== "Paid") {
        return res.status(403).json({ message: "Access restricted to paid users only" });
    }

    next();
};


exports.optionalAuthentication = (req, res, next) => {
  let token = req.headers.authorization;
  if (token) {
    try {
      const decoded = verifyToken(token.replace("Bearer ", ""));
      req.userId = decoded.userId;
      req.userRole = decoded.userRole;
    } catch (error) {
      // Handle token verification error
    }
  }
  next();
};

const validateForgot = [
  body("phone")
    .trim()
    .isLength({ min: 11, max: 11 })
    .withMessage("১১ সংখ্যার সঠিক ফোন নাম্বার লিখুন"),
];
exports.forgotPassword = [
  validateForgot,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { phone } = req.body;
    try {
      const user = await User.findOne({ phone });
      if (!user) {
        return res
          .status(404)
          .json({ message: "User not found with this phone" });
      }

      // Generate a 6-digit random number for the OTP
      const resetToken = Math.floor(100000 + Math.random() * 900000); // Ensures a 6-digit number

      user.resetPasswordToken = resetToken.toString(); // Store as a string
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour to expire

      await user.save();

      // Send OTP via phone (assuming you have a mail setup)
      const message = `Your password reset code is ${resetToken}`;
      // Replace the next line with your actual phone sending logic
      // await sendphone(user.phone, 'Your Password Reset Token', message);

      res.status(200).json({ message: "Token sent to phone!" });
    } catch (error) {
      res.status(500).json({
        message: "Error generating reset token",
        error: error.message,
      });
    }
  },
];

const validateReset = [
  body("token")
    .trim()
    .isLength({ min: 6, max: 6 })
    .withMessage("Token must be 6 characters."),
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("New Password must be at least 6 characters long.")
    .withMessage("New Password must be at least 6 characters "),
];

exports.resetPassword = [
  validateReset,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { token, newPassword } = req.body;
    try {
      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }, // Checks if the token hasn't expired
      });

      if (!user) {
        return res
          .status(400)
          .json({ message: "Password reset token is invalid or has expired" });
      }

      // Set the new password
      user.password = newPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      // Log the user in after resetting password
      const jwtToken = singToken(user._id, user.role); // Reuse existing function
      res
        .status(200)
        .json({ message: "Password has been reset!", token: jwtToken });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error resetting password", error: error.message });
    }
  },
];

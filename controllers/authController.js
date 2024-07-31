const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

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

exports.signup = async (req, res) => {
  try {
    const { name, phone, password } = req.body;
    // Check if the mobile number is already registered
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Mobile number is already registered" });
    }

    // Generate a unique username based on the name
    const username = await generateUniqueUsername(name.replace(/\s+/g, "")); // Removes spaces from name for username

    // Create a new user with the unique username
    const newUser = new User({ name, phone, password, username });
    await newUser.save();
    createSendToken(newUser, 201, res);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Controller function for user login
exports.login = async (req, res) => {
  try {
    const { phone, password } = req.body;
    // Check if the user exists
    const user = await User.findOne({ phone });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid mobile number or password" });
    }

    // Check if password matches
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

exports.forgotPassword = async (req, res) => {
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
    res
      .status(500)
      .json({ message: "Error generating reset token", error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
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
};

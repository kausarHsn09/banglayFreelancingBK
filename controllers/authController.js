const jwt = require("jsonwebtoken");
const User = require("../models/userModel");


const singToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
  return token;
};
const createSendToken = (user, statusCode, res) => {
  const token = singToken(user._id);
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signup = async (req, res) => {
  try {
    const { name, mobileNumber,password } = req.body;
    // Check if the mobile number is already registered
    const existingUser = await User.findOne({ mobileNumber });
    if (existingUser) {
      return res.status(400).json({ message: 'Mobile number is already registered' });
    }
    const newUser = new User({ name, mobileNumber,password });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// Controller function for user login
exports.login = async (req, res) => {
  try {
    const { mobileNumber,password } = req.body;
    // Check if the user exists
    const user = await User.findOne({ mobileNumber });
    if (!user) {
      return res.status(401).json({ message: 'Invalid mobile number or password' });
    }

    // Check if password matches
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid mobile number or password' });
    }
    createSendToken(user,200,res)
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


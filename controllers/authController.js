const jwt = require("jsonwebtoken");
const User = require("../models/userModel");


const singToken = (id,role) => {
  const token = jwt.sign({ userId:id,userRole:role }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
  return token;
};
const createSendToken = (user, statusCode, res) => {
  const token = singToken(user._id,user.role);
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
    createSendToken(newUser,201,res)
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
 
  let token=req.headers.authorization

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


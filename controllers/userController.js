const User = require("../models/userModel");
const { body, validationResult } = require("express-validator");
exports.allUser = async (req, res) => {
  try {
    const user = await User.find();
    res.status(200).json(user);
  } catch (error) {
    console.log("Can not find User", error);
  }
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


// Fetch user information excluding sensitive data
exports.getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password -role");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user information", error });
  }
};

const validateSignup = [
  body("name")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Name is required.")
    .isAlpha("en-US", { ignore: " " })
    .withMessage("Name must contain only letters and spaces."),
  body("phone")
    .trim()
    .isLength({ min: 11, max: 11 })
    .withMessage("Phone number must be exactly 11 characters."),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long.")
    .withMessage("Password must be at least 6 characters "),
];

exports.createUser = [
  validateSignup,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, phone, password } = req.body;
    const username = await generateUniqueUsername(name.replace(/\s+/g, ""));
    const referraCodeSignature='tm'+username
    try {
      // Check if the mobile number already exists
      const existingUser = await User.findOne({ phone });
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "User already exists with this phone number." });
      }
      // Create a new user
      const user = new User({
        name,
        phone,
        password,
        username,
        referralCode:referraCodeSignature
      });
      await user.save();
      res.status(201).json({ message: "User created successfully!", user });
    } catch (error) {
      res.status(500).json({ message: "Error creating user", error });
    }
  },
];

exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "No user found with this ID" });
    }
    // Check if the user's role is 'Admin'
    if (user.role === "Admin") {
      return res.status(403).json({ message: "Cannot delete an Admin user" });
    }
    // Proceed to delete if not an Admin
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};

exports.editUser = async (req, res) => {
  const { id } = req.params;
  const { name, userType, balance, role,referralCount } = req.body;

  // Prepare the fields that need to be updated
  const updateFields = {};
  if (name) updateFields.name = name;
  if (userType) updateFields.userType = userType;
  if (balance) updateFields.balance = balance;
  if (role) updateFields.role = role;
  if (referralCount) updateFields.referralCount = referralCount;

  try {
    const user = await User.findByIdAndUpdate(id, updateFields, { new: true });
    if (!user) {
      return res.status(404).json({ message: "No user found with this ID" });
    }
    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
};


exports.countMyReferralUses = async (req, res) => {
  // Assuming the user's ID is stored in `req.userId` after authentication
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Use the user's own referral code to count how many times it has been used
    const count = await User.countDocuments({
      referralCodeUsed: user.referralCode,
    });
    res.status(200).json({
      referralCode: user.referralCode,
      count: count,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error counting referrals", error: error.message });
  }
};

// Function to fetch a single user by username, phone, or _id
exports.findUser = async (req, res) => {
  const { username, phone, id } = req.query;

  try {
    // Query to find a user by one of the provided identifiers
    const user = await User.findOne({
      $or: [
        { _id: id },
        { username: username },
        { phone: phone }
      ]
    }).select("-password"); // Exclude sensitive data

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
};

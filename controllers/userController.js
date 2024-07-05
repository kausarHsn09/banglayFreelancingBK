const User = require("../models/userModel");

exports.allUser =async(req,res)=>{
    try {
        const user =await User.find()
        res.status(200).json(user)

    } catch (error) {
        console.log('Can not find User',error)
    } 
}


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

exports.createUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // Check if the mobile number already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this Email number." });
        }
        // Create a new user
        const user = new User({
            name,
            email,
            password
        });
        await user.save();
        res.status(201).json({ message: "User created successfully!", user });
    } catch (error) {
        res.status(500).json({ message: "Error creating user", error });
    }
};

exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "No user found with this ID" });
        }
        // Check if the user's role is 'Admin'
        if (user.role === 'Admin') {
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
    const { name } = req.body;
    try {
        const user = await User.findByIdAndUpdate(id, { name }, { new: true });
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
        const count = await User.countDocuments({ referralCodeUsed: user.referralCode });
        res.status(200).json({
            referralCode: user.referralCode,
            count: count
        });
    } catch (error) {
        res.status(500).json({ message: "Error counting referrals", error: error.message });
    }
};

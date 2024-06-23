const User = require("../models/userModel");

exports.allUser =async(req,res)=>{
    try {
        const user =await User.find()
        res.status(200).json(user)

    } catch (error) {
        console.log('Can not find User',error)
    } 
}
exports.createUser = async (req, res) => {
    const { name, mobileNumber, password } = req.body;
    try {
        // Check if the mobile number already exists
        const existingUser = await User.findOne({ mobileNumber });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this mobile number." });
        }
        // Create a new user
        const user = new User({
            name,
            mobileNumber,
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

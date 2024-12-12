const User = require("../models/userModel");

// Function to complete a task
exports.completeTask = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Decrease task count and update balance
        if (user.tasksLeft > 0) {
            user.tasksLeft -= 1;
            user.balance += 40; // Increment balance, adjust value as needed
            await user.save();

            res.json({ message: 'Task completed successfully', balance: user.balance, tasksLeft: user.tasksLeft });
        } else {
            res.status(400).json({ message: 'No tasks left for today' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Function to reset tasks daily
exports.resetTasks = async (req, res) => {
    try {
        const { taskLimit } = req.body; // Number of tasks to reset to, sent via request
        const result = await User.updateMany({}, { $set: { tasksLeft: taskLimit } });

        res.json({ message: 'Tasks reset successfully', updatedCount: result.nModified });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

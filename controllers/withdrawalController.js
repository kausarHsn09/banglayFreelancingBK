// withdrawalController.js
const User = require('../models/userModel');
const Transaction = require('../models/transactionModel');


exports.getAllTransactions = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const transactions = await Transaction.find()
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);
        const totalTransactions = await Transaction.countDocuments();
        
        res.status(200).json({
            status: 'success',
            data: transactions,
            total: totalTransactions,
            page: page,
            totalPages: Math.ceil(totalTransactions / limit)
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve transactions", error: error.message });
    }
};

exports.getUserTransactions = async (req, res) => {
    const userId = req.params.userId;
    try {
        const { page = 1, limit = 10 } = req.query;
        const transactions = await Transaction.find({ user: userId })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);
        const totalTransactions = await Transaction.countDocuments({ user: userId });

        res.status(200).json({
            status: 'success',
            data: transactions,
            total: totalTransactions,
            page: page,
            totalPages: Math.ceil(totalTransactions / limit)
        });
    } catch (error) {
        res.status(500).json({ message: `Failed to retrieve transactions for user ${userId}`, error: error.message });
    }
};

exports.requestWithdrawal = async (req, res) => {
  const { amount } = req.body;
  const user = await User.findById(req.userId);

  if (user.balance < amount) {
    return res.status(400).json({ message: "Insufficient balance" });
  }

  user.balance -= amount;
  await user.save();

  const transaction = new Transaction({
    user: req.userId,
    amount: amount,
    type: 'debit'
  });
  await transaction.save();

  res.status(200).json({ message: "Withdrawal request created, pending approval" });
};

exports.approveWithdrawal = async (req, res) => {
  const { transactionId } = req.params;
  const transaction = await Transaction.findById(transactionId);

  if (!transaction) {
    return res.status(404).json({ message: "Transaction not found" });
  }

  transaction.status = 'approved';
  await transaction.save();
  res.status(200).json({ message: "Withdrawal approved" });
};


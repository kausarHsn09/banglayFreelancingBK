// withdrawalController.js
const User = require('../models/userModel');
const Transaction = require('../models/transactionModel');

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


// withdrawalController.js
const User = require("../models/userModel");
const Transaction = require("../models/transactionModel");
const { body, validationResult } = require("express-validator");

exports.getAllTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const filterOptions = {};

    // Add status filter if provided
    if (status) {
      filterOptions.status = status;
    }

    const transactions = await Transaction.find(filterOptions)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    const totalTransactions = await Transaction.countDocuments(filterOptions);

    res.status(200).json({
      status: "success",
      data: transactions,
      total: totalTransactions,
      page: page,
      totalPages: Math.ceil(totalTransactions / limit),
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Failed to retrieve transactions",
        error: error.message,
      });
  }
};

exports.getUserTransactions = async (req, res) => {
  const userId = req.userId;
  try {
    const { page = 1, limit = 10, type } = req.query;
    let query = { user: userId };

    // Add type to query if it's specifically requested
    if (type) {
      query.type = type;
    }

    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    const totalTransactions = await Transaction.countDocuments(query);

    res.status(200).json({
      status: "success",
      data: transactions,
      total: totalTransactions,
      page: page,
      totalPages: Math.ceil(totalTransactions / limit),
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message: `Failed to retrieve transactions for user ${userId}`,
        error: error.message,
      });
  }
};

const validateWithRaw = [
  body("accountNumber")
    .trim()
    .isLength({ min: 11, max: 11 })
    .withMessage("Account Number must be exactly 11 characters."),
];

exports.requestWithdrawal = [
  validateWithRaw,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { amount, accountNumber } = req.body; // Retrieve amount and account number from the request body
    const user = await User.findById(req.userId);

    if (user.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Create a pending transaction with the account number
    const transaction = new Transaction({
      user: req.userId,
      amount: amount,
      accountNumber: accountNumber,
      type: "debit",
      status: "pending",
    });
    await transaction.save();

    res
      .status(200)
      .json({ message: "Withdrawal request created, pending approval" });
  },
];

exports.approveWithdrawal = exports.approveWithdrawal = async (req, res) => {
  const { transactionId } = req.params;
  const transaction = await Transaction.findById(transactionId);

  if (!transaction) {
    return res.status(404).json({ message: "Transaction not found" });
  }

  // Check if transaction is already processed
  if (transaction.status !== "pending") {
    return res
      .status(400)
      .json({ message: "Transaction is already processed" });
  }

  const user = await User.findById(transaction.user);

  // Check if user still has enough balance (in case balance was changed)
  if (user.balance < transaction.amount) {
    return res.status(400).json({ message: "Insufficient balance" });
  }

  // Deduct the amount from user's balance
  user.balance -= transaction.amount;
  await user.save();

  // Update the transaction status
  transaction.status = "approved";
  await transaction.save();

  res.status(200).json({ message: "Withdrawal approved" });
};

exports.declineWithdrawal = async (req, res) => {
  const { transactionId } = req.params;
  const { notes } = req.body; // Retrieve notes from the request body

  try {
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (transaction.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Transaction is already processed" });
    }

    // Update the transaction status to 'declined' and add notes
    transaction.status = "declined";
    transaction.notes = notes; // Save the decline notes
    await transaction.save();

    res.status(200).json({ message: "Withdrawal declined", transaction });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Failed to decline withdrawal`, error: error.message });
  }
};

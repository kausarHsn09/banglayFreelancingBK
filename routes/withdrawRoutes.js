const express = require("express");
const authController = require("../controllers/authController");
const withdrawalController = require('../controllers/withdrawalController');
const router = express.Router();



// Request a withdrawal
router.post('/', authController.protectRoute, withdrawalController.requestWithdrawal);

// Admin approval for withdrawals
router.post('/approve/:transactionId', authController.protectRoute, authController.restrictToAdmin, withdrawalController.approveWithdrawal);


module.exports = router;
const express = require("express");
const authController = require("../controllers/authController");
const withdrawalController = require("../controllers/withdrawalController");
const router = express.Router();

router.get(
  "/transactions",
  authController.protectRoute,
  withdrawalController.getAllTransactions
);
// Route to get transactions for a specific user
router.get(
  "/transactions/user",
  authController.protectRoute,
  withdrawalController.getUserTransactions
);

// Route to request a withdrawal
router.post(
  "/request",
  authController.protectRoute,
  withdrawalController.requestWithdrawal
);

// Route to approve a withdrawal request
router.patch(
  "/approve/:transactionId",
  authController.protectRoute,
  authController.restrictToAdmin,
  withdrawalController.approveWithdrawal
);

// Route to decline a withdrawal request
router.patch(
  "/decline/:transactionId",
  authController.protectRoute,
  authController.restrictToAdmin,
  withdrawalController.declineWithdrawal
);

module.exports = router;

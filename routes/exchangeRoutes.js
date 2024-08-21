const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const exchangeController = require("../controllers/exchangeController");

router.get(
  "/feed",
  authController.protectRoute,
  authController.restrictToPaidUsers,
  exchangeController.getExchangeFeed
);
router.post(
  "/create",
  authController.protectRoute,
  authController.restrictToPaidUsers,
  exchangeController.createExchange
);
router.get(
  "/my_exchanges",
  authController.protectRoute,
  authController.restrictToPaidUsers,
  exchangeController.getMyExchanges
);
router.get(
  "/:exchangeId/accepted",
  authController.protectRoute,
  authController.restrictToPaidUsers,
  exchangeController.getAcceptedExchanges
);
router.post(
  "/accept/:exchangeId",
  authController.protectRoute,
  authController.restrictToPaidUsers,
  exchangeController.acceptExchange
);
router.delete(
  "/:exchangeId",
  authController.protectRoute,
  authController.restrictToPaidUsers,
  exchangeController.deleteExchange
);

module.exports = router;

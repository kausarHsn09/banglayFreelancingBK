const express = require('express');
const router = express.Router();
const exchangeController = require('../controllers/exchangeController');
const authController = require('../controllers/authController')
router.get('/feed', exchangeController.getExchangeFeed);
router.post('/create',authController.protectRoute, exchangeController.createExchange);
router.get('/my_exchanges',authController.protectRoute,exchangeController.getMyExchanges);
router.post('/accept/:exchangeId', exchangeController.acceptExchange);

module.exports = router;

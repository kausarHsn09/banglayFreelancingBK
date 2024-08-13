const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController')
const exchangeController = require('../controllers/exchangeController');



router.get('/feed',authController.protectRoute, exchangeController.getExchangeFeed);
router.post('/create',authController.protectRoute, exchangeController.createExchange);
router.get('/my_exchanges',authController.protectRoute,exchangeController.getMyExchanges);
router.get('/:exchangeId/accepted',authController.protectRoute, exchangeController.getAcceptedExchanges);
router.post('/accept/:exchangeId',authController.protectRoute, exchangeController.acceptExchange);
router.delete('/:exchangeId',authController.protectRoute, exchangeController.deleteExchange);


module.exports = router;

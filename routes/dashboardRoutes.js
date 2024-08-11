const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardStatsController'); 
const authController = require('../controllers/authController');

router.get('/stats',authController.protectRoute,authController.restrictToAdmin, dashboardController.getDashboardStats);

module.exports = router;

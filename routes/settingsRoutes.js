const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const settingsController = require('../controllers/settingsController');

// Get a setting value
router.get('/:key', authController.protectRoute, settingsController.getSetting);

// Update a setting value
router.put('/:key', authController.protectRoute, authController.restrictToAdmin, settingsController.updateSetting);


module.exports = router;
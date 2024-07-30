const express = require('express');
const router = express.Router();
const utilsController = require('../controllers/utilsController');
const authController = require("../controllers/authController");
router.get('/:id', utilsController.getUtilsById);
router.get('/', utilsController.getUtilsByAttribute);
// POST route for creating a utility
router.post('/', utilsController.createUtils);

// PUT route for updating a utility
router.put('/:id',authController.protectRoute, utilsController.updateUtils);

module.exports = router;
const express = require('express');
const router = express.Router();
const utilsController = require('../controllers/utilsController');
const authController = require("../controllers/authController");

router.get('/:id',authController.protectRoute, utilsController.getUtilsById);
router.get('/',authController.protectRoute, utilsController.getUtilsByAttribute);
// POST route for creating a utility
router.post('/',authController.protectRoute,authController.restrictToAdmin, utilsController.createUtils);

// PUT route for updating a utility
router.put('/:id',authController.protectRoute,authController.restrictToAdmin, utilsController.updateUtils);
// Delete utility route
router.delete("/:id", utilsController.deleteUtils);
module.exports = router;
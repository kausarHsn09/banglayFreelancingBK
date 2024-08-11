const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController')
const bioController = require('../controllers/bioController')

router.get('/',authController.protectRoute, bioController.getAllBios);
router.post('/',authController.protectRoute,authController.restrictToAdmin, bioController.createBio);
router.delete('/:id',authController.protectRoute,authController.restrictToAdmin, bioController.deleteBio);

module.exports = router;
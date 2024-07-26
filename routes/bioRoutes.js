const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController')
const bioController = require('../controllers/bioController')

router.get('/', bioController.getAllBios);
router.post('/',authController.protectRoute, bioController.createBio);
router.patch('/:id',authController.protectRoute, bioController.deleteBio);

module.exports = router;
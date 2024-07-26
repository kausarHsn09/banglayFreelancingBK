const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController')
const bioController = require('../controllers/bioController')

router.get('/', bioController.getAllBios);
router.post('/', bioController.createBio);
router.patch('/:id', bioController.deleteBio);

module.exports = router;
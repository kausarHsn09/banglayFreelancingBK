const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController')
const contentController = require('../controllers/contentController')

router.get('/',authController.protectRoute, contentController.getAllContent);
router.post('/',authController.protectRoute,authController.restrictToAdmin, contentController.createContent);
router.delete('/:id',authController.protectRoute,authController.restrictToAdmin, contentController.deleteContent);

module.exports = router;
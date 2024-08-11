// routes/captionRoutes.js
const express = require('express');
const router = express.Router();
const captionController = require('../controllers/captionController');
const authController = require('../controllers/authController');

router.get('/category/:categoryId',authController.protectRoute, captionController.getCaptionsByCategory);
router.get('/',authController.protectRoute, captionController.getAllCaptions);
router.post('/',authController.protectRoute,authController.restrictToAdmin, captionController.createCaption);
router.delete('/:id',authController.protectRoute,authController.restrictToAdmin, captionController.deleteCaption);
module.exports = router;

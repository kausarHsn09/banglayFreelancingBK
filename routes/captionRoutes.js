// routes/captionRoutes.js
const express = require('express');
const router = express.Router();
const captionController = require('../controllers/captionController');
const authController = require('../controllers/authController');

router.get('/category/:categoryId', captionController.getCaptionsByCategory);
router.post('/',authController.protectRoute,authController.restrictToAdmin, captionController.createCaption);
router.delete('/:id', captionController.deleteCaption);
module.exports = router;

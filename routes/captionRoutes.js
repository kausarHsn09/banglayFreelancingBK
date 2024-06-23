// routes/captionRoutes.js
const express = require('express');
const router = express.Router();
const captionController = require('../controllers/captionController');

router.get('/category/:categoryId', captionController.getCaptionsByCategory);
router.post('/', captionController.createCaption);

module.exports = router;

// routes/hashtagRoutes.js
const express = require('express');
const router = express.Router();
const hashtagController = require('../controllers/hashtagController');

router.get('/category/:categoryId', hashtagController.getHashtagsByCategory);
router.post('/', hashtagController.createHashtag);

module.exports = router;

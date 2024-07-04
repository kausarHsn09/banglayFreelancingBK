// routes/hashtagRoutes.js
const express = require('express');
const router = express.Router();
const hashtagController = require('../controllers/hashtagController');
const authController = require('../controllers/authController');

router.get('/', hashtagController.getAllHashtags);
router.get('/category/:categoryId', hashtagController.getHashtagsByCategory);
router.post('/',authController.protectRoute,authController.restrictToAdmin, hashtagController.createHashtag);
router.delete('/:id', hashtagController.deleteHashtag);
module.exports = router;

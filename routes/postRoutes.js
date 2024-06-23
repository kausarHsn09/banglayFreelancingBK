// routes/postRoutes.js
const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

router.get('/category/:categoryId', postController.getPostsByCategory);
router.post('/', postController.createPost);

module.exports = router;

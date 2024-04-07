const express = require('express');
const router = express.Router();
const courseVideoController = require('../controllers/courseVideoController');

// Routes for course videos
router.get('/', courseVideoController.getAllVideos);
router.get('/:id', courseVideoController.getVideoById);
router.post('/', courseVideoController.createVideo);
router.put('/:id', courseVideoController.updateVideo);
router.delete('/:id', courseVideoController.deleteVideo);

module.exports = router;

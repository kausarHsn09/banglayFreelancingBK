const express = require('express');
const router = express.Router();
const courseVideoController = require('../controllers/courseVideoController');

// Routes for course videos
router.get('/videos', courseVideoController.getAllVideos);
router.get('/videos/:id', courseVideoController.getVideoById);
router.post('/videos', courseVideoController.createVideo);
router.put('/videos/:id', courseVideoController.updateVideo);
router.delete('/videos/:id', courseVideoController.deleteVideo);

module.exports = router;

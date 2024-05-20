const express = require('express');
const router = express.Router();
const courseVideoController = require('../controllers/courseVideoController');
const authController = require('../controllers/authController');

// Routes for course videos
router.get('/', courseVideoController.getAllVideos);
router.get('/course/:courseId',authController.optionalAuthentication, courseVideoController.getVideosByCourseId);

router.get('/:id',authController.protectRoute, courseVideoController.getVideoById);
router.post('/',authController.protectRoute,authController.restrictToAdmin, courseVideoController.createVideo);
router.put('/:id',authController.protectRoute,authController.restrictToAdmin, courseVideoController.updateVideo);
router.delete('/:id',authController.protectRoute,authController.restrictToAdmin, courseVideoController.deleteVideo);
router.put('/positions',authController.protectRoute,authController.restrictToAdmin, courseVideoController.updateVideoPositions);    
module.exports = router;


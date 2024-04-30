const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const authController = require('../controllers/authController');

// Routes for courses
router.post('/', authController.protectRoute, authController.restrictToAdmin, courseController.createCourse);
router.get('/', courseController.getAllCourses);
// Place the specific route before the general ID route
router.get('/mycourse',authController.protectRoute,courseController.getMyCourses);
// General ID route comes after specific routes
router.get('/:id', courseController.getCourseById);
router.put('/:id', authController.protectRoute, authController.restrictToAdmin, courseController.updateCourse);
router.delete('/:id', authController.protectRoute, authController.restrictToAdmin, courseController.deleteCourse);

module.exports = router;

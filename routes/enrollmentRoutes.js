const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');

// Routes for enrollments
router.post('/enrollments', enrollmentController.createEnrollment);
router.get('/enrollments', enrollmentController.getAllEnrollments);
router.get('/enrollments/:id', enrollmentController.getEnrollmentById);
router.patch('/enrollments/:id', enrollmentController.updatePaymentStatus);
router.delete('/enrollments/:id', enrollmentController.deleteEnrollment);

module.exports = router;

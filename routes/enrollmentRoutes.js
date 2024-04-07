const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');

// Routes for enrollments
router.post('/', enrollmentController.createEnrollment);
router.get('/', enrollmentController.getAllEnrollments);
router.get('/:id', enrollmentController.getEnrollmentById);
router.patch('/:id', enrollmentController.updatePaymentStatus);
router.delete('/:id', enrollmentController.deleteEnrollment);

module.exports = router;

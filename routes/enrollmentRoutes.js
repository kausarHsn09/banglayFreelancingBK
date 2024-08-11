const express = require("express");
const router = express.Router();
const enrollmentController = require("../controllers/enrollmentController");
const authController = require("../controllers/authController");

// Routes for enrollments
router.post(
  "/",
  authController.protectRoute,
  enrollmentController.createEnrollment
);
router.get(
  "/",
  authController.protectRoute,
  authController.restrictToAdmin,
  enrollmentController.getAllEnrollments
);
router.get(
  "/:id",
  authController.protectRoute,
  authController.restrictToAdmin,
  enrollmentController.getEnrollmentById
);
router.patch(
  "/:id",
  authController.protectRoute,
  authController.restrictToAdmin,
  enrollmentController.updatePaymentStatus
);
router.post(
  "/confirm-payment/:id",
  authController.protectRoute,
  authController.restrictToAdmin,
  enrollmentController.confirmPaymentAndUpdateReferral
);

router.delete(
  "/:id",
  authController.protectRoute,
  authController.restrictToAdmin,
  enrollmentController.deleteEnrollment
);

module.exports = router;

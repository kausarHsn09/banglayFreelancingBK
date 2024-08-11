const express = require("express");
const router = express.Router();
const courseVideoController = require("../controllers/courseVideoController");
const authController = require("../controllers/authController");

// Routes for course videos
router.get("/",authController.protectRoute, courseVideoController.getAllVideos);
router.get(
  "/course/:courseId",
  authController.protectRoute,
  courseVideoController.getVideosByCourseId
);

router.get(
  "/:id",
  authController.protectRoute,
  courseVideoController.getVideoById
);
router.post(
  "/",
  authController.protectRoute,
  authController.restrictToAdmin,
  courseVideoController.createVideo
);
router.put(
  "/:id",
  authController.protectRoute,
  authController.restrictToAdmin,
  courseVideoController.updateVideo
);
router.delete(
  "/:id",
  authController.protectRoute,
  authController.restrictToAdmin,
  courseVideoController.deleteVideo
);

// Correct order for the updateVideoPositions route
router.patch(
  "/positions",
  authController.protectRoute,
  authController.restrictToAdmin,
  courseVideoController.updateVideoPositions
);

module.exports = router;

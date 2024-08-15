const express = require("express");
const {
  getAllSubmissions,
  createChallenge,
  getAllChallenges,
  createSubmission,
  deleteChallenge,
  getSubmissionsByChallenge,
} = require("../controllers/challengeController");
const authController = require("../controllers/authController");
const router = express.Router();

// Challenges
router.post(
  "/",
  authController.protectRoute,
  authController.restrictToAdmin,
  createChallenge
);
router.get(
  "/",
  authController.protectRoute,
  getAllChallenges
);
router.delete(
  "/:id",
  authController.protectRoute,
  authController.restrictToAdmin,
  deleteChallenge
); // Route to delete a challenge
// Submissions
router.post("/submissions", authController.protectRoute, createSubmission);
router.get(
  "/submissions",
  authController.protectRoute,
  getAllSubmissions
);
router.get(
  "/:challengeId/submissions",
  authController.protectRoute,
  getSubmissionsByChallenge
);

module.exports = router;

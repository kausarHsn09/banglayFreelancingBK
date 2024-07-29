const express = require('express');
const {getAllSubmissions,createChallenge, getAllChallenges, createSubmission,deleteChallenge, getSubmissionsByChallenge } = require('../controllers/challengeController');
const authController = require('../controllers/authController')
const router = express.Router();

// Challenges
router.post('/', createChallenge);
router.get('/', getAllChallenges);
router.delete('/:id', deleteChallenge); // Route to delete a challenge
// Submissions
router.post('/submissions',authController.protectRoute, createSubmission);
router.get('/submissions', getAllSubmissions);
router.get('/:challengeId/submissions', getSubmissionsByChallenge);

module.exports = router;
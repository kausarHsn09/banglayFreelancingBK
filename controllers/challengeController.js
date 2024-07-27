const Challenge = require('../models/challengeModel');
const Submission = require('../models/submissionModel');

exports.createChallenge = async (req, res) => {
    try {
        const challenge = new Challenge(req.body);
        await challenge.save();
        res.status(201).json(challenge);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getAllChallenges = async (req, res) => {
    try {
        const challenges = await Challenge.find();
        res.json(challenges);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteChallenge = async (req, res) => {
    try {
        const challenge = await Challenge.findById(req.params.id);
        if (!challenge) {
            return res.status(404).json({ message: 'Challenge not found' });
        }

        // // Optional: Check if there are submissions related to this challenge
        // const submissions = await Submission.find({ challengeId: req.params.id });
        // if (submissions.length > 0) {
        //     return res.status(400).json({ message: 'Cannot delete challenge because there are submissions linked to it.' });
        // }

        await Challenge.findByIdAndDelete(req.params.id);
        res.json({ message: 'Challenge deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createSubmission = async (req, res) => {
    try {
        const submission = new Submission(req.body);
        await submission.save();
        res.status(201).json(submission);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Fetch all submissions across all challenges
exports.getAllSubmissions = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10 if not specified
        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            populate: 'challengeId', // Populate the challenge details
            sort: { submittedAt: -1 } // Sort submissions by date in descending order
        };

        const result = await Submission.paginate({}, options);
        res.json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Fetch submissions for a specific challenge
exports.getSubmissionsByChallenge = async (req, res) => {
    try {
        const { challengeId } = req.params;
        const { page = 1, limit = 10, sortBy = 'submittedAt', order = 'desc' } = req.query;
        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            populate: 'challengeId', // Optionally populate challenge details
            sort: { [sortBy]: order === 'desc' ? -1 : 1 }
        };

        const result = await Submission.paginate({ challengeId: challengeId }, options);
        if (result.docs.length === 0) {
            return res.status(404).json({ message: 'No submissions found for this challenge.' });
        }
        res.json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
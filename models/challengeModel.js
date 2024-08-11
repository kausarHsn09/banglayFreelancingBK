const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    coverImage: { type: String, required: true},
    createdAt: { type: Date, default: Date.now }
});

const Challenge = mongoose.model('Challenge', challengeSchema);

module.exports = Challenge;
// controllers/hashtagController.js
const Hashtag = require('../models/hashtagModel');

exports.getHashtagsByCategory = async (req, res) => {
    try {
        const hashtags = await Hashtag.find({ category: req.params.categoryId }).populate('category');
        res.json(hashtags);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createHashtag = async (req, res) => {
    const hashtag = new Hashtag({
        category: req.body.category,
        text: req.body.text
    });

    try {
        const newHashtag = await hashtag.save();
        res.status(201).json(newHashtag);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

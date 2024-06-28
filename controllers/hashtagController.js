// controllers/hashtagController.js
const Hashtag = require('../models/hashtagModel');



exports.getAllHashtags = async (req, res) => {
    try {
        const hashtag = await Hashtag.find();
        res.json(hashtag);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


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

exports.deleteHashtag = async (req, res) => {
    try {
        const hashtag = await Hashtag.findByIdAndDelete(req.params.id);
        if (!hashtag) return res.status(404).json({ message: 'Hashtag not found' });
        res.json({ message: 'Hashtag deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
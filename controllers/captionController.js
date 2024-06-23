// controllers/captionController.js
const Caption = require('../models/captionModel');

exports.getCaptionsByCategory = async (req, res) => {
    try {
        const captions = await Caption.find({ category: req.params.categoryId }).populate('category');
        res.json(captions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createCaption = async (req, res) => {
    const caption = new Caption({
        category: req.body.category,
        text: req.body.text
    });

    try {
        const newCaption = await caption.save();
        res.status(201).json(newCaption);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

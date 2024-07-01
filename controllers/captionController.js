// controllers/captionController.js
const Caption = require('../models/captionModel');



exports.getAllCaptions = async (req, res) => {
    try {
        const caption = await Caption.find();
        res.json(caption);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

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

exports.deleteCaption = async (req, res) => {
    try {
        const caption = await Caption.findByIdAndDelete(req.params.id);
        if (!caption) return res.status(404).json({ message: 'Caption not found' });
        res.json({ message: 'Caption deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
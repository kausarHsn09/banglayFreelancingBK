// controllers/captionController.js
const Script = require('../models/scriptModel');



exports.getAllScripts = async (req, res) => {
    try {
        const script = await Script.find();
        res.json(script);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getScriptsByCategory = async (req, res) => {
    try {
        const scripts = await Script.find({ category: req.params.categoryId }).populate('category');
        res.json(scripts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createScript = async (req, res) => {
    const script = new Script({
        category: req.body.category,
        text: req.body.text
    });

    try {
        const newScript = await script.save();
        res.status(201).json(newScript);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteScript= async (req, res) => {
    try {
        const script = await Script.findByIdAndDelete(req.params.id);
        if (!script) return res.status(404).json({ message: 'script not found' });
        res.json({ message: 'script deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
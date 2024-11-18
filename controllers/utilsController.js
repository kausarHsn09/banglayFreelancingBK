const Utils = require("../models/utilsModel");

// Create utility
exports.createUtils = async (req, res) => {
  const utils = new Utils({
    merchantBkash: req.body.merchantBkash,
    contactNumber: req.body.contactNumber,
    contactText: req.body.contactText,
    type: req.body.type,
    name: req.body.name,
    merchantLabel: req.body.merchantLabel,
    coureseInstructionUrl: req.body.coureseInstructionUrl,
    telegramLink: req.body.telegramLink,
  });

  try {
    const newUtils = await utils.save();
    res.status(201).json(newUtils);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


exports.getUtilsById = async (req, res) => {
  try {
    const utils = await Utils.findById(req.params.id);
    if (!utils) {
      return res.status(404).json({ message: 'Utility not found' });
    }
    res.status(200).json(utils);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllUtils = async (req, res) => {
  try {
    const allUtils = await Utils.find();
    res.status(200).json(allUtils);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update utility
exports.updateUtils = async (req, res) => {
  try {
    const updatedUtils = await Utils.findByIdAndUpdate(
      req.params.id,
      {
        merchantBkash: req.body.merchantBkash,
        contactNumber: req.body.contactNumber,
        contactText: req.body.contactText,
        merchantLabel: req.body.merchantLabel,
        coureseInstructionUrl: req.body.coureseInstructionUrl,
        telegramLink: req.body.telegramLink,
      },
      { new: true }  // This option returns the modified document rather than the original
    );

    if (!updatedUtils) {
      return res.status(404).json({ message: "Utility not found" });
    }

    res.status(200).json(updatedUtils);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get utilities by attribute
exports.getUtilsByAttribute = async (req, res) => {
  try {
    const query = {};

    // Build query based on provided parameters
    if (req.query.type) {
      query.type = req.query.type;
    }
    if (req.query.name) {
      query.name = req.query.name;
    }

    const utils = await Utils.find(query);

    if (!utils.length) {
      return res.status(404).json({ message: 'No utility data found matching criteria' });
    }
    res.status(200).json(utils);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete utility
exports.deleteUtils = async (req, res) => {
  try {
    const utils = await Utils.findByIdAndDelete(req.params.id);

    if (!utils) {
      return res.status(404).json({ message: "Utility not found" });
    }

    res.status(200).json({ message: "Utility deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

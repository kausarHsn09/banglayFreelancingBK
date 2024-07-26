const Utils = require("../models/utilsModel");

exports.createutils = async (req, res) => {
  const utils = new Utils({
    merchantBkash: req.body.merchantBkash,
    contactNumber: req.body.contactNumber,
    contactText: req.body.contactText,
  });

  try {
    const newUtils = await utils.save();
    res.status(201).json(newUtils);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


const Content = require("../models/contentIdeasModel");
const HandleError = require('../utils/handleError')
// Helper function to handle errors and send responses

exports.createContent = async (req, res) => {
  const bio = new Content({ text: req.body.text });

  try {
    const newBio = await bio.save();
    res.status(201).json(newBio);
  } catch (err) {
    HandleError.handleError(res, err, 400);
  }
};

exports.getAllContent = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: { createdAt: -1 },
    };

    const bios = await Content.paginate({}, options);
    res.json(bios);
  } catch (err) {
    HandleError.handleError(res, err);
  }
};

exports.deleteContent = async (req, res) => {
  try {
    const bio = await Content.findByIdAndDelete(req.params.id);
    if (!bio) {
      return res.status(404).json({ message: "Bio not found" });
    }
    res.json({ message: "Bio deleted" });
  } catch (err) {
    HandleError.handleError(res, err);
  }
};
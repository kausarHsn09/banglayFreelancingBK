const Bio = require("../models/bioideasModel");
const HandleError = require('../utils/handleError')
// Helper function to handle errors and send responses


// Create a new bio entry
exports.createBio = async (req, res) => {
  const bio = new Bio({ text: req.body.text });

  try {
    const newBio = await bio.save();
    res.status(201).json(newBio);
  } catch (err) {
    HandleError.handleError(res, err, 400);
  }
};

// Get all bio entries with pagination
exports.getAllBios = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: { createdAt: -1 },
    };

    const bios = await Bio.paginate({}, options);
    res.json(bios);
  } catch (err) {
    HandleError.handleError(res, err);
  }
};

// Delete a bio entry by ID
exports.deleteBio = async (req, res) => {
  try {
    const bio = await Bio.findByIdAndDelete(req.params.id);
    if (!bio) {
      return res.status(404).json({ message: "Bio not found" });
    }
    res.json({ message: "Bio deleted" });
  } catch (err) {
    HandleError.handleError(res, err);
  }
};
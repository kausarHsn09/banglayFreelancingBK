const Bio = require("../models/bioideasModel");

exports.createBio = async (req, res) => {
  const bio = new Bio({
    text: req.body.text,
  });

  try {
    const newBio = await bio.save();
    res.status(201).json(newBio);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getAllBios = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Pagination and filtering parameters

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: { createdAt: -1 }, // Newest first
    };

    const bio = await Exchange.paginate(options);

    res.json(bio);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteBio = async (req, res) => {
  try {
    const bio = await Bio.findByIdAndDelete(req.params.id);
    if (!bio) return res.status(404).json({ message: "Bio not found" });
    res.json({ message: "Bio deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const Content = require("../models/contentIdeasModel");

exports.createContent = async (req, res) => {
  const content = new Content({
    text: req.body.text,
  });

  try {
    const newContent = await content.save();
    res.status(201).json(newContent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getAllContent = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Pagination and filtering parameters

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: { createdAt: -1 }, // Newest first
    };

    const content = await Content.paginate(options);

    res.json(content);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteContent = async (req, res) => {
  try {
    const content = await Content.findByIdAndDelete(req.params.id);
    if (!content) return res.status(404).json({ message: "Content not found" });
    res.json({ message: "Content deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

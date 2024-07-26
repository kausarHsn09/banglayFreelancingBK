const Nickname = require("../models/nicknameideasModel");

exports.createNickname = async (req, res) => {
  const nickname = new Nickname({
    text: req.body.text,
  });

  try {
    const newNickname = await nickname.save();
    res.status(201).json(newNickname);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getAllNickname = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Pagination and filtering parameters

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: { createdAt: -1 }, // Newest first
    };

    const nickname = await Nickname.paginate(options);

    res.json(nickname);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteNickname = async (req, res) => {
  try {
    const nickname = await Nickname.findByIdAndDelete(req.params.id);
    if (!nickname) return res.status(404).json({ message: "Nickname not found" });
    res.json({ message: "Nickname deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

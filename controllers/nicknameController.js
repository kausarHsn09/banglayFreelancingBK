const Nickname = require("../models/nicknameideasModel");
const HandleError = require('../utils/handleError')


exports.createNickname = async (req, res) => {
  const bio = new Nickname({ text: req.body.text });

  try {
    const newBio = await bio.save();
    res.status(201).json(newBio);
  } catch (err) {
    HandleError.handleError(res, err, 400);
  }
};

exports.getAllNickname = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: { createdAt: -1 },
    };

    const bios = await Nickname.paginate({}, options);
    res.json(bios);
  } catch (err) {
    HandleError.handleError(res, err);
  }
};

exports.deleteNickname = async (req, res) => {
  try {
    const bio = await Nickname.findByIdAndDelete(req.params.id);
    if (!bio) {
      return res.status(404).json({ message: "Bio not found" });
    }
    res.json({ message: "Bio deleted" });
  } catch (err) {
    HandleError.handleError(res, err);
  }
};
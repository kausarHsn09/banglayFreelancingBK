const TalentHunt = require("../models/talentHuntModel");

exports.createTalentHunt = async (req, res) => {
  const talentHunt = new TalentHunt({
    link: req.body.link,
    name: req.body.name,
    phone: req.body.phone,
    tiktokUsername: req.body.tiktokUsername,
  });

  try {
    const newTalenthunt = await talentHunt.save();
    res.status(201).json(newTalenthunt);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getAllTalent = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query; // Pagination and filtering parameters
    const query = {};

    if (status) {
      query.status = status; // Filter by type if specified
    }

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: { createdAt: -1 }, // Newest first
    };

    const talenthunt = await TalentHunt.paginate(query, options);

    res.json(talenthunt);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
//patch
exports.updateStatus = async (req, res) => {
  try {
    const talenthunt = await TalentHunt.findById(req.params.id);
    if (!talenthunt) {
      return res.status(404).json({ message: "Talenthunt not found" });
    }
    talenthunt.paymentStatus = req.body.status;
    await talenthunt.save();
    res.json(talenthunt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

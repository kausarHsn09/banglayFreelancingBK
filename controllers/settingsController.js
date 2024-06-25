const Settings = require('../models/settingsModel');

exports.getSetting = async (req, res) => {
  try {
    const { key } = req.params;
    const setting = await Settings.findOne({ key });
    if (!setting) {
      return res.status(404).json({ message: 'Setting not found' });
    }
    res.status(200).json(setting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSetting = async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;
    const setting = await Settings.findOneAndUpdate({ key }, { value }, { new: true, upsert: true });
    res.status(200).json(setting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

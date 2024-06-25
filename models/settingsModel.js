// settingsModel.js
const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  }
});

const Settings = mongoose.model('Settings', settingsSchema);
module.exports = Settings;

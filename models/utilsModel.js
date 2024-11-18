const mongoose = require("mongoose");

const utilsSchema = new mongoose.Schema({
  merchantBkash: { type: String, required: true },
  merchantLabel: { type: String},
  coureseInstructionUrl: { type: String },
  telegramLink: { type: String},
  contactNumber: { type: String, required: true },
  contactText: { type: String, required: true },
  type: { type: String, required: true }, 
  name: { type: String, required: true },
});

module.exports = mongoose.model("Utils", utilsSchema);

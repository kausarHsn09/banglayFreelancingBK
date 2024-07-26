const mongoose = require("mongoose");

const utilsSchema = new mongoose.Schema({
  merchantBkash: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  contactText: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Utils", utilsSchema);

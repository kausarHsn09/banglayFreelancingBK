const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const talentSchema = new mongoose.Schema({
  link: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  tiktokUsername: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "declined"],
    default: "pending",
    required: true,
  },
});
talentSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Talenthunt", talentSchema);

const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const exchangeSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["like", "comment", "share", "follower"],
    required: true,
  },
  post: {
    type: String,
  },
  targetLink: { type: String, required: true },
  acceptedExchanges: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      link: { type: String },
      acceptedAt: { type: Date, default: Date.now },
    },
  ],
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

exchangeSchema.plugin(mongoosePaginate);
const Exchange = mongoose.model("Exchange", exchangeSchema);

module.exports = Exchange;

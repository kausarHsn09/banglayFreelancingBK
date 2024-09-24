const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A team must have a name"],
    unique: true
  },
   creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true,
  },
   members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
    },
  ],
  teamArea: {
    type: String,
    required: [true, "Team area is required"],
  },
  telegramLink: String,
  contactNumber: String,
  level: {
    type: String,
    enum: ["Bronze", "Silver", "Gold", "Platinum", "Diamond"],
    default: "Bronze"
  },
  code:{
    type: String,
  }
});

teamSchema.methods.calculateLevel = function () {
  const memberCount = this.members.length;

  if (memberCount <= 10) return "Bronze";
  if (memberCount <= 50) return "Silver";
  if (memberCount <= 100) return "Gold";
  if (memberCount <= 200) return "Platinum";
  return "Diamond";
};

const Team = mongoose.model("Team", teamSchema);
module.exports = Team;

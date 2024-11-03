const mongoose = require("mongoose");

const SocialAccountSchema = new mongoose.Schema({
  email: { type: String, maxlength: 150 },
  name: { type: String, maxlength: 100 },
  provider: { type: String, maxlength: 20 },
  provider_id: { type: String, maxlength: 50 },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("SocialAccount", SocialAccountSchema);

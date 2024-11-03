const mongoose = require("mongoose");

const CVSchema = new mongoose.Schema({
  cv_url: { type: String, maxlength: 255 },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("CV", CVSchema);

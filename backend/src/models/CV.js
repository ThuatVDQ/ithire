const mongoose = require("mongoose");

const CVSchema = new mongoose.Schema({
  cv_id: { type: Number, unique: true, required: true },
  cv_url: { type: String, maxlength: 255 },
  user_id: { type: Number, ref: "User", required: true, required: true },  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("CV", CVSchema);

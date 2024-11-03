const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  category_id: { type: Number, unique: true, required: true },
  name: { type: String, required: true, maxlength: 255 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Category", CategorySchema);

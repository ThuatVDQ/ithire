const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const CategorySchema = new mongoose.Schema({
  category_id: { type: Number, unique: true },
  name: { type: String, required: true, maxlength: 255 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

CategorySchema.plugin(AutoIncrement, { inc_field: 'category_id' });

module.exports = mongoose.model("Category", CategorySchema);

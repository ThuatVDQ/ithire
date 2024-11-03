const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const CVSchema = new mongoose.Schema({
  cv_id: { type: Number, unique: true },
  cv_url: { type: String, maxlength: 255 },
  user_id: { type: Number, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

CVSchema.plugin(AutoIncrement, { inc_field: 'cv_id' });

module.exports = mongoose.model("CV", CVSchema);

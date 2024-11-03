const mongoose = require("mongoose");

const SkillSchema = new mongoose.Schema({
  skill_id: { type: Number, unique: true, required: true },
  name: { type: String, required: true, maxlength: 255 },
});

module.exports = mongoose.model("Skill", SkillSchema);

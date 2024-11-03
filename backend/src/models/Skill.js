const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const SkillSchema = new mongoose.Schema({
  skill_id: { type: Number, unique: true },
  name: { type: String, required: true, maxlength: 255 },
});

SkillSchema.plugin(AutoIncrement, { inc_field: 'skill_id' });

module.exports = mongoose.model("Skill", SkillSchema);

const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const JobSkillSchema = new mongoose.Schema({
  job_skill_id: { type: Number, unique: true },
  job_id: { type: Number, ref: "Job", required: true },
  skill_id: { type: Number, ref: "Skill", required: true },
});

JobSkillSchema.plugin(AutoIncrement, { inc_field: 'job_skill_id' });

module.exports = mongoose.model("JobSkill", JobSkillSchema);

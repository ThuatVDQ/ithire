const mongoose = require("mongoose");

const JobSkillSchema = new mongoose.Schema({
  job_skill_id: { type: Number, unique: true, required: true },
  job_id: { type: Number, ref: "Job", required: true },
  skill_id: { type: Number, ref: "Skill", required: true },
});

module.exports = mongoose.model("JobSkill", JobSkillSchema);

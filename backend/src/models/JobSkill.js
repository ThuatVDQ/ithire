const mongoose = require("mongoose");

const JobSkillSchema = new mongoose.Schema({
  job_id: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
  skill_id: { type: mongoose.Schema.Types.ObjectId, ref: "Skill" },
});

module.exports = mongoose.model("JobSkill", JobSkillSchema);

const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const JobSchema = new mongoose.Schema({
  job_id: { type: Number, unique: true },
  apply_number: { type: Number, default: 0 },
  benefit: { type: String },
  currency: { type: String, enum: ["USD", "VND"] },
  deadline: { type: Date },
  description: { type: String },
  experience: { type: String, maxlength: 50 },
  level: { type: String, maxlength: 50 },
  like_number: { type: Number, default: 0 },
  position: { type: String, maxlength: 50 },
  requirement: { type: String },
  salary_start: { type: Number },
  salary_end: { type: Number },
  slots: { type: Number },
  status: { type: String, enum: ["CLOSED", "HOT", "OPEN", "PENDING", "REJECTED"] },
  title: { type: String, maxlength: 255 },
  type: { type: String, enum: ["FULL_TIME", "INTERNSHIP", "PART_TIME"] },
  views: { type: Number, default: 0 },
  category_ids: [{ type: Number, ref: "Category" }],
  company_id: { type: Number, ref: "Company", required: true },
  skills: [{ type: Number, ref: "Skill" }],  
  addresses: [{ type: Number, ref: "Address" }],  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

JobSchema.plugin(AutoIncrement, { inc_field: "job_id" });

module.exports = mongoose.model("Job", JobSchema);

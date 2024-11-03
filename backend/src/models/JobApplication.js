const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const JobApplicationSchema = new mongoose.Schema({
  job_application_id: { type: Number, unique: true },
  status: {
    type: String,
    enum: ["ACCEPTED", "IN_PROGRESS", "REJECTED", "SEEN"],
  },
  cv_id: { type: Number, ref: "CV", required: true },
  job_id: { type: Number, ref: "Job", required: true },
  user_id: { type: Number, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

JobApplicationSchema.plugin(AutoIncrement, { inc_field: 'job_application_id' });

module.exports = mongoose.model("JobApplication", JobApplicationSchema);
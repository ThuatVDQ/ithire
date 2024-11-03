const mongoose = require("mongoose");

const JobApplicationSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ["ACCEPTED", "IN_PROGRESS", "REJECTED", "SEEN"],
  },
  cv_id: { type: mongoose.Schema.Types.ObjectId, ref: "CV", required: true },
  job_id: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("JobApplication", JobApplicationSchema);

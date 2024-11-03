const mongoose = require("mongoose");

const JobAddressSchema = new mongoose.Schema({
  address_id: { type: mongoose.Schema.Types.ObjectId, ref: "Address" },
  job_id: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
});

module.exports = mongoose.model("JobAddress", JobAddressSchema);

const mongoose = require("mongoose");

const JobAddressSchema = new mongoose.Schema({
  job_address_id: { type: Number, unique: true, required: true },
  address_id: { type: Number, ref: "Address", required: true },
  job_id: { type: Number, ref: "Job", required: true },
});

module.exports = mongoose.model("JobAddress", JobAddressSchema);

const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const JobAddressSchema = new mongoose.Schema({
  job_address_id: { type: Number, unique: true },
  address_id: { type: Number, ref: "Address", required: true },
  job_id: { type: Number, ref: "Job", required: true },
});

JobAddressSchema.plugin(AutoIncrement, { inc_field: 'job_address_id' });

module.exports = mongoose.model("JobAddress", JobAddressSchema);

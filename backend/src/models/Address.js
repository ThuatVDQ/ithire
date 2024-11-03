const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema({
  city: { type: String, maxlength: 50 },
  country: { type: String, maxlength: 50 },
  district: { type: String, maxlength: 50 },
  street: { type: String, maxlength: 255 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Address", AddressSchema);

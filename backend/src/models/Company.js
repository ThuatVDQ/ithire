const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema({
  company_id: { type: Number, unique: true, required: true },
  address: { type: String, maxlength: 255 },
  description: { type: String },
  email: { type: String, maxlength: 255 },
  logo: { type: String, maxlength: 255 },
  name: { type: String, maxlength: 255 },
  phone: { type: String, maxlength: 20 },
  scale: { type: Number },
  status: { type: String, maxlength: 20 },
  tax_code: { type: String, maxlength: 50 },
  web_url: { type: String, maxlength: 255 },
  created_by: { type: Number, ref: "User", required: true },  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Company", CompanySchema);

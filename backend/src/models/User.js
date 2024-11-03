const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  user_id: { type: Number, unique: true, required: true },
  avatar_url: { type: String, maxlength: 255 },
  email: { type: String, maxlength: 255 },
  full_name: { type: String, maxlength: 255 },
  gender: { type: String, maxlength: 10 },
  introduction: { type: String },
  password: { type: String, maxlength: 255 },
  phone: { type: String, maxlength: 20 },
  status: { type: String, enum: ["ACTIVE", "INACTIVE"] },
  role_id: { type: Number, ref: "Role", required: true },   
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", UserSchema);

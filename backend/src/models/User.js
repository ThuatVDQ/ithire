const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const UserSchema = new mongoose.Schema({
  user_id: { type: Number, unique: true },
  avatar_url: { type: String, maxlength: 255 },
  email: { type: String, maxlength: 255 },
  full_name: { type: String, maxlength: 255 },
  gender: { type: String, maxlength: 10 },
  introduction: { type: String },
  password: { type: String, maxlength: 255 },
  phone: { type: String, maxlength: 10 },
  status: { type: String, enum: ["ACTIVE", "INACTIVE"] },
  role_id: { type: Number, ref: "Role", required: true },
  favorite_jobs: [{ type: Number, ref: "Job" }], 
  isOTPVerified: { type: Boolean, default: false },
  otp: { type: String }, 
  otpExpire: { type: Date }, 
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

UserSchema.plugin(AutoIncrement, { inc_field: 'user_id' });

module.exports = mongoose.model("User", UserSchema);

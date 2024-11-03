const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  notification_id: { type: Number, unique: true, required: true },
  message: { type: String, maxlength: 255 },
  send_at: { type: Date },
  user_id: { type: Number, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Notification", NotificationSchema);

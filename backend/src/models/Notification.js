const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  message: { type: String, maxlength: 255 },
  send_at: { type: Date },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Notification", NotificationSchema);

const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const NotificationSchema = new mongoose.Schema({
  notification_id: { type: Number, unique: true },
  message: { type: String, maxlength: 255 },
  send_at: { type: Date },
  user_id: { type: Number, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

NotificationSchema.plugin(AutoIncrement, { inc_field: 'notification_id' });

module.exports = mongoose.model("Notification", NotificationSchema);

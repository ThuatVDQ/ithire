const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const RoleSchema = new mongoose.Schema({
  role_id: { type: Number, unique: true },
  name: { type: String, required: true, maxlength: 255 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

RoleSchema.plugin(AutoIncrement, { inc_field: 'role_id' });

module.exports = mongoose.model("Role", RoleSchema);

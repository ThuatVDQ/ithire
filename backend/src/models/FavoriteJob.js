const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const FavoriteJobSchema = new mongoose.Schema({
  favorite_job_id: { type: Number, unique: true },
  job_id: { type: Number, ref: "Job", required: true },
  user_id: { type: Number, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

FavoriteJobSchema.plugin(AutoIncrement, { inc_field: 'favorite_job_id' });

module.exports = mongoose.model("FavoriteJob", FavoriteJobSchema);

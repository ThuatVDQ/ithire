const mongoose = require("mongoose");

const FavoriteJobSchema = new mongoose.Schema({
  favorite_job_id: { type: Number, unique: true, required: true },
  job_id: { type: Number, ref: "Job", required: true },    
  user_id: { type: Number, ref: "User", required: true },    
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("FavoriteJob", FavoriteJobSchema);

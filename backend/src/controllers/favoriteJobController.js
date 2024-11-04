const FavoriteJob = require("../models/FavoriteJob");
const Job = require("../models/Job");
const User = require("../models/User");

exports.addFavoriteJob = async (req, res) => {
  try {
    const { job_id } = req.params;
    const userEmail = req.user.email;

    // Tìm user dựa trên email
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Kiểm tra xem công việc có tồn tại không
    const job = await Job.findOne({ job_id });
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Kiểm tra xem công việc đã được yêu thích chưa
    const existingFavorite = await FavoriteJob.findOne({ user_id: user._id, job_id });
    if (existingFavorite) {
      return res.status(400).json({ message: "Job already in favorites" });
    }

    // Thêm công việc vào danh sách yêu thích
    const favoriteJob = new FavoriteJob({ user_id: user._id, job_id });
    await favoriteJob.save();

    // Tăng `like_number` trong `Job`
    job.like_number += 1;
    await job.save();

    res.status(201).json({ message: "Job added to favorites", favoriteJob });
  } catch (error) {
    console.error("Error adding favorite job:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.removeFavoriteJob = async (req, res) => {
  try {
    const { job_id } = req.params;
    const userEmail = req.user.email;

    // Tìm user dựa trên email
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Tìm và xóa công việc khỏi danh sách yêu thích
    const favoriteJob = await FavoriteJob.findOneAndDelete({ user_id: user._id, job_id });
    if (!favoriteJob) {
      return res.status(404).json({ message: "Job not found in favorites" });
    }

    // Giảm `like_number` trong `Job`
    const job = await Job.findOne({ job_id });
    if (job) {
      job.like_number = Math.max(0, job.like_number - 1); // Giảm nhưng không thấp hơn 0
      await job.save();
    }

    res.status(200).json({ message: "Job removed from favorites" });
  } catch (error) {
    console.error("Error removing favorite job:", error);
    res.status(500).json({ message: "Server error" });
  }
};

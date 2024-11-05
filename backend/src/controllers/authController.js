const bcrypt = require("bcrypt");
const User = require("../models/User");
const Role = require("../models/Role");
const jwt = require("jsonwebtoken");
const Job = require("../models/Job");

exports.signup = async (req, res) => {
  try {
    const { email, full_name, password, retypePassword, phone, role_id } =
      req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    if (email) {
      const existingUserWithEmail = await User.findOne({ email });
      if (existingUserWithEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    // Kiểm tra mật khẩu trùng khớp
    if (password !== retypePassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Kiểm tra nếu role_id hợp lệ
    const roleExists = await Role.exists({ role_id: role_id });
    if (!roleExists) {
      return res.status(400).json({ message: "Invalid role_id" });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo người dùng mới
    const user = new User({
      email,
      full_name,
      password: hashedPassword,
      phone,
      role_id,
    });

    await user.save();
    res.status(201).json({ message: "User signed up successfully", user });
  } catch (error) {
    console.error("Error signing up user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, role_id } = req.body;

    const user = await User.findOne({ email });
    if (!user || role_id !== user.role_id)
      return res.status(404).json({ error: "User not found!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ error: "Invalid email or password" });

    // Generate JWT
    const token = jwt.sign(
      { email: user.email, role_id: user.role_id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: "Login failed!" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user_email = req.user.email; 
    const { full_name, gender, introduction } = req.body;

    // Tìm người dùng cần cập nhật bằng email từ token
    const user = await User.findOne({ email: user_email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Chỉ cập nhật các trường được phép
    if (full_name) user.full_name = full_name;
    if (gender) user.gender = gender;
    if (introduction) user.introduction = introduction;
    user.updatedAt = Date.now();

    await user.save();

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const fs = require("fs");
const path = require("path");

// Hàm upload avatar
exports.uploadAvatar = async (req, res) => {
  try {
    const user_email = req.user.email;
    const user = await User.findOne({ email: user_email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Xóa file avatar cũ nếu tồn tại
    if (user.avatar_url) {
      const oldPath = path.join(__dirname, "../../", user.avatar_url);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath); // Xóa file cũ
      }
    }

    // Cập nhật avatar mới
    user.avatar_url = `/uploads/${req.file.filename}`;
    user.updatedAt = Date.now();
    await user.save();

    res.status(200).json({ message: "Avatar uploaded successfully", avatar_url: user.avatar_url });
  } catch (error) {
    console.error("Error uploading avatar:", error);
    res.status(500).json({ message: "Server error" });
  }
};

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
    if (user.favorite_jobs.includes(job_id)) {
      return res.status(400).json({ message: "Job already in favorites" });
    }

    // Thêm job_id vào danh sách yêu thích của người dùng
    user.favorite_jobs.push(job_id);
    await user.save();

    // Tăng `like_number` trong `Job`
    job.like_number += 1;
    await job.save();

    res.status(201).json({ message: "Job added to favorites"});
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

    // Kiểm tra xem công việc có trong danh sách yêu thích không
    if (!user.favorite_jobs.includes(parseInt(job_id))) {
      return res.status(404).json({ message: "Job not found in favorites" });
    }

    // Xóa job_id khỏi danh sách yêu thích
    user.favorite_jobs = user.favorite_jobs.filter(id => id !== parseInt(job_id));
    await user.save();

    // Giảm `like_number` trong `Job`
    const job = await Job.findOne({ job_id });
    if (job) {
      job.like_number = Math.max(0, job.like_number - 1); // Đảm bảo không xuống dưới 0
      await job.save();
    }

    res.status(200).json({ message: "Job removed from favorites", favorite_jobs: user.favorite_jobs });
  } catch (error) {
    console.error("Error removing favorite job:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUserInfo = async (req, res) => {
  try {
    // Lấy email từ token (req.user được thiết lập từ middleware verifyToken)
    const userEmail = req.user.email;

    // Tìm người dùng theo email
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Trả về thông tin người dùng dưới dạng một đối tượng
    res.status(200).json({
      user: {
        user_id: user.user_id,
        email: user.email,
        full_name: user.full_name,
        phone: user.phone,
        gender: user.gender,
        introduction: user.introduction,
        avatar_url: user.avatar_url,
      },
    });
  } catch (error) {
    console.error("Error fetching user info:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUserInfo = async (req, res) => {
  try {
    // Lấy email từ token (req.user được thiết lập từ middleware verifyToken)
    const userEmail = req.user.email;

    // Tìm người dùng theo email
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Trả về thông tin người dùng dưới dạng một đối tượng
    res.status(200).json({
      user: {
        user_id: user.user_id,
        email: user.email,
        full_name: user.full_name,
        phone: user.phone,
        gender: user.gender,
        introduction: user.introduction,
        avatar_url: user.avatar_url,
      },
    });
  } catch (error) {
    console.error("Error fetching user info:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUserInfo = async (req, res) => {
  try {
    // Lấy email từ token (req.user được thiết lập từ middleware verifyToken)
    const userEmail = req.user.email;

    // Tìm người dùng theo email
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Trả về thông tin người dùng dưới dạng một đối tượng
    res.status(200).json({
      user: {
        user_id: user.user_id,
        email: user.email,
        full_name: user.full_name,
        phone: user.phone,
        gender: user.gender,
        introduction: user.introduction,
        avatar_url: user.avatar_url,
      },
    });
  } catch (error) {
    console.error("Error fetching user info:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const userEmail = req.user.email; // Lấy email từ `req.user` đã được thiết lập trong middleware `verifyToken`
    const { currentPassword, newPassword, retypePassword } = req.body;

    // Tìm người dùng theo email
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Kiểm tra mật khẩu hiện tại
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Kiểm tra xem `newPassword` có trùng với `retypePassword` không
    if (newPassword !== retypePassword) {
      return res.status(400).json({ message: "New passwords do not match" });
    }

    // Mã hóa mật khẩu mới
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    user.updatedAt = Date.now();

    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ message: "Server error" });
  }
};
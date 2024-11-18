const bcrypt = require("bcrypt");
const User = require("../models/User");
const Role = require("../models/Role");
const Company = require("../models/Company");
const { sendOTPForAction, verifyOTP } = require("../configs/emailService");
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
    await sendOTPForAction(email, "signup");
    res
      .status(201)
      .json({ message: "User signed up successfully. OTP sent to email." });
  } catch (error) {
    console.error("Error signing up user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Xác thực OTP từ Redis
    const verificationMessage = await verifyOTP(email, otp);
    await User.findOneAndUpdate(
      { email },
      { isOTPVerified: true },
      { new: true }
    );

    res.status(200).json({ message: verificationMessage });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(400).json({ message: error.message });
  }
};

exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Kiểm tra xem người dùng có tồn tại không
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Gửi lại OTP ngay cả khi OTP chưa hết hạn
    await sendOTPForAction(email, "resend");

    res.status(200).json({ message: "OTP resent successfully" });
  } catch (error) {
    console.error("Error resending OTP:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.sendResetPasswordOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Kiểm tra xem người dùng có tồn tại không
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Gửi OTP để reset mật khẩu
    await sendOTPForAction(email, "reset password");

    res
      .status(200)
      .json({
        message:
          "OTP sent to email for password reset. Please check your inbox.",
      });
  } catch (error) {
    console.error("Error sending reset password OTP:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Đặt lại mật khẩu mới
exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    // Kiểm tra nếu mật khẩu mới và xác nhận mật khẩu giống nhau
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Kiểm tra xem OTP đã được xác thực chưa
    const user = await User.findOne({ email });
    if (!user || !user.isOTPVerified) {
      return res
        .status(400)
        .json({ message: "OTP is not verified or has expired" });
    }

    // Mã hóa mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Cập nhật mật khẩu mới vào cơ sở dữ liệu
    await User.findOneAndUpdate(
      { email },
      {
        password: hashedPassword,
        otp: null,
        otpExpire: null,
        isOTPVerified: true,
      },
      { new: true }
    );

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(400).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, role_id } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }

    if (!user.isOTPVerified) {
      return res
        .status(403)
        .json({
          error: "OTP not verified. Please verify your OTP before logging in.",
        });
    }

    // Kiểm tra role_id nếu có trong yêu cầu
    if (role_id !== user.role_id) {
      return res.status(403).json({ error: "Invalid role ID" });
    }

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
    const { full_name, gender, introduction, phone } = req.body;

    // Tìm người dùng cần cập nhật bằng email từ token
    const user = await User.findOne({ email: user_email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Chỉ cập nhật các trường được phép
    if (full_name) user.full_name = full_name;
    if (gender) user.gender = gender;
    if (introduction) user.introduction = introduction;
    if (phone) user.phone = phone;
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

    res
      .status(200)
      .json({
        message: "Avatar uploaded successfully",
        avatar_url: user.avatar_url,
      });
  } catch (error) {
    console.error("Error uploading avatar:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.addFavoriteJob = async (req, res) => {
  try {
    const { job_id } = req.body;
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

    res.status(201).json({ message: "Job added to favorites" });
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
    user.favorite_jobs = user.favorite_jobs.filter(
      (id) => id !== parseInt(job_id)
    );
    await user.save();

    // Giảm `like_number` trong `Job`
    const job = await Job.findOne({ job_id });
    if (job) {
      job.like_number = Math.max(0, job.like_number - 1); // Đảm bảo không xuống dưới 0
      await job.save();
    }

    res
      .status(200)
      .json({
        message: "Job removed from favorites",
        favorite_jobs: user.favorite_jobs,
      });
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
        status: user.status
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
    const { oldPassword, newPassword, confirmPassword } = req.body;

    // Tìm người dùng theo email
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Kiểm tra mật khẩu hiện tại
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Kiểm tra xem `newPassword` có trùng với `retypePassword` không
    if (newPassword !== confirmPassword) {
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

exports.dashboard = async (req, res) => {
  try {
    const userEmail = req.user.email;

    // Tìm user và xác định nếu user có phải là admin
    const user = await User.findOne({ email: userEmail });
    if (!user || user.role_id !== 1) {
      // role_id = 1 cho admin
      return res
        .status(403)
        .json({
          message: "Access denied. Only admins can access this dashboard.",
        });
    }

    // Thống kê tổng số công việc
    const totalJobs = await Job.countDocuments();

    // Thống kê tổng số công ty
    const totalCompanies = await Company.countDocuments();

    // Thống kê tổng số người dùng (không bao gồm admin)
    const totalUsers = await User.countDocuments({ role_id: { $ne: 1 } }); // Exclude admin

    // Thống kê số công việc đang mở
    const openJobs = await Job.countDocuments({ status: "OPEN" });

    // Lấy 5 công ty mới nhất
    const recentCompanies = await Company.find()
      .sort({ createdAt: -1 })
      .limit(5);

    // Lấy 5 người dùng mới nhất (không bao gồm admin)
    const recentUsers = await User.find({ role_id: { $ne: 1 } }) // Exclude admin
      .sort({ createdAt: -1 })
      .limit(5);

    // Tính ngày 2 tuần trước
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    // Lấy công ty đã được tạo trong 2 tuần gần nhất
    const companiesInLastTwoWeeks = await Company.countDocuments({
      createdAt: { $gte: twoWeeksAgo },
    });

    // Lấy người dùng đã đăng ký trong 2 tuần gần nhất (không bao gồm admin)
    const usersInLastTwoWeeks = await User.countDocuments({
      createdAt: { $gte: twoWeeksAgo },
      role_id: { $ne: 1 }, // Exclude admin
    });

    // Trả về dữ liệu thống kê cho dashboard
    res.status(200).json({
      totalJobs,
      totalCompanies,
      totalUsers,
      openJobs,
      recentCompanies,
      recentUsers,
      companiesInLastTwoWeeks,
      usersInLastTwoWeeks,
    });
  } catch (error) {
    console.error("Error fetching admin dashboard:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const role_id = parseInt(req.query.role_id) || null;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const userEmail = req.user.email;

    // Tìm user và xác định nếu user có phải là admin
    const user = await User.findOne({ email: userEmail });
    if (!user || user.role_id !== 1) {
      // role_id = 1 cho admin
      return res
        .status(403)
        .json({
          message: "Access denied. Only admins can access this dashboard.",
        });
    }

    const query = { role_id: { $ne: 1 } };
    if (role_id) {
      query.role_id = role_id;
    }

    // Lấy tất cả người dùng (không bao gồm admin)
    //filter theo role nua
    const users = await User.find(query)
      .sort({ createdAt: -1 }) // Sắp xếp theo thời gian tạo mới nhất
      .skip(skip)
      .limit(limit);
    const totalUsers = await User.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / limit);

    res.status(200).json({
      users,
      pagination: {
        totalUsers,
        totalPages,
        currentPage: page,
        pageSize: limit,
      },
    });
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.blockUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { status } = req.body;

    const userEmail = req.user.email;

    // Tìm user và xác định nếu user có phải là admin
    const user = await User.findOne({ email: userEmail });
    if (!user || user.role_id !== 1) {
      // role_id = 1 cho admin
      return res
        .status(403)
        .json({ message: "Access denied. Only admins can block users." });
    }

    // Tìm người dùng cần block
    console.log(user_id);
    const userBlock = await User.findOne({ user_id: user_id });
    if (!userBlock) {
      return res.status(404).json({ message: "User not found" });
    }

    userBlock.status = status;
    userBlock.updatedAt = Date.now();
    userBlock.isOTPVerified = false;
    await userBlock.save();

    res.status(200).json({ message: "User blocked successfully" });
  } catch (error) {
    console.error("Error blocking user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

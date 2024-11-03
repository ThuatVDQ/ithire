const bcrypt = require("bcrypt");
const User = require("../models/User");
const Role = require("../models/Role");

exports.signup = async (req, res) => {
  try {
    const { email, full_name, password, retypePassword, phone, role_id } = req.body;

    // Kiểm tra bắt buộc ít nhất một trong hai trường email hoặc phone
    if (!email && !phone) {
      return res.status(400).json({ message: "Either email or phone is required" });
    }

    // Kiểm tra nếu email hoặc phone đã tồn tại
    if (email) {
      const existingUserWithEmail = await User.findOne({ email });
      if (existingUserWithEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    if (phone) {
      const existingUserWithPhone = await User.findOne({ phone });
      if (existingUserWithPhone) {
        return res.status(400).json({ message: "Phone number already exists" });
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

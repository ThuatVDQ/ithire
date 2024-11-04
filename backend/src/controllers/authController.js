const bcrypt = require("bcrypt");
const User = require("../models/User");
const Role = require("../models/Role");
const jwt = require("jsonwebtoken");
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
    if (!user && role_id !== user.role_id)
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

const bcrypt = require("bcrypt");
const User = require("../models/User");

exports.signup = async (req, res) => {
  try {
    const { email, full_name, password, retypePassword, phone, role_id } =
      req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    if (password !== retypePassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

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

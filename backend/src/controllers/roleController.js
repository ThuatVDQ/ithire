const Role = require("../models/Role");

exports.createRole = async (req, res) => {
  try {
    const { name } = req.body;

    // Kiểm tra nếu tên vai trò đã tồn tại
    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      return res.status(400).json({ message: "Role already exists" });
    }

    // Tạo vai trò mới
    const role = new Role({ name });
    await role.save();

    res.status(201).json({ message: "Role created successfully", role });
  } catch (error) {
    console.error("Error creating role:", error);
    res.status(500).json({ message: "Server error" });
  }
};

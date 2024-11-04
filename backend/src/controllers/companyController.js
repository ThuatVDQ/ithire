const Company = require("../models/Company");
const User = require("../models/User");
exports.createCompany = async (req, res) => {
  try {
    const {
      name,
      address,
      description,
      email,
      logo,
      phone,
      scale,
      status,
      tax_code,
      web_url,
    } = req.body;

    if (!req.user.email || !req.user.role_id) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No user ID provided" });
    }

    const existingCompany = await Company.findOne({ name });
    if (existingCompany) {
      return res.status(400).json({ message: "Company name already exists" });
    }

    if (req.user.role_id !== 2) {
      return res.status(403).json({
        message:
          "Forbidden: Only recruiter can create companies",
      });
    }
    const user = await User.findOne({ email: req.user.email });

    const created_by = user.user_id;
    const company = new Company({
      name,
      address,
      description,
      email,
      logo,
      phone,
      scale,
      status,
      tax_code,
      web_url,
      created_by,
    });

    await company.save();
    res.status(201).json({ message: "Company created successfully", company });
  } catch (error) {
    console.error("Error creating company:", error);
    res.status(500).json({ message: "Server error" });
  }
};

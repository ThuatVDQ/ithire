const Company = require("../models/Company");
const User = require("../models/User");
const Job = require("../models/Job");
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

exports.getCompanyDetail = async (req, res) => {
  try {
    const { company_id } = req.params;

    // Tìm công ty theo company_id
    const company = await Company.findOne({ company_id });
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Tìm danh sách công việc của công ty
    const jobs = await Job.find({ company_id });

    res.status(200).json({
      company,
      jobs
    });
  } catch (error) {
    console.error("Error fetching company detail:", error);
    res.status(500).json({ message: "Server error" });
  }
};
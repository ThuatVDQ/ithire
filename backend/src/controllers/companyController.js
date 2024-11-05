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

exports.getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const companies = await Company.find().skip(skip).limit(limit);
    const totalCompanies = await Company.countDocuments();
    const totalPages = Math.ceil(totalCompanies / limit);

    res.status(200).json({
      companies,
      pagination: {
        totalCompanies,
        totalPages,
        currentPage: page,
        pageSize: limit,
      },
    });
  } catch (error) {
    console.error("Error fetching all jobs:", error);
    res.status(500).json({ message: "Server error" });
  }
}

exports.getCompanyByUser = async (req, res) => {
  try {
    // Lấy email từ token
    const userEmail = req.user.email;

    // Tìm người dùng dựa trên email
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Kiểm tra vai trò của người dùng
    if (user.role_id !== 2) {
      return res.status(403).json({ message: "Forbidden: Only recruiters can access this information" });
    }

    // Tìm công ty do người dùng này tạo ra
    const company = await Company.findOne({ created_by: user.user_id });
    if (!company) {
      return res.status(404).json({ message: "Company not found for this user" });
    }

    res.status(200).json({ company });
  } catch (error) {
    console.error("Error fetching company by user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const Company = require("../models/Company");
const User = require("../models/User");

exports.updateCompany = async (req, res) => {
  try {
    const userEmail = req.user.email;

    // Tìm người dùng dựa trên email
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Kiểm tra vai trò của người dùng
    if (user.role_id !== 2) {
      return res.status(403).json({ message: "Forbidden: Only recruiters can update company information" });
    }

    // Tìm công ty do người dùng này tạo ra
    const company = await Company.findOne({ created_by: user.user_id });
    if (!company) {
      return res.status(404).json({ message: "Company not found for this user" });
    }

    const { name, address, description, scale, web_url } = req.body;

    if (name) company.name = name;
    if (address) company.address = address;
    if (description) company.description = description;
    if (scale) company.scale = scale;
    if (web_url) company.web_url = web_url;

    // Lưu các thay đổi vào cơ sở dữ liệu
    await company.save();

    res.status(200).json({ message: "Company updated successfully", company });
  } catch (error) {
    console.error("Error updating company:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const Company = require("../models/Company");
const User = require("../models/User");
const Job = require("../models/Job");
const JobApplication = require("../models/JobApplication");
const fs = require("fs");
const path = require("path");
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
        message: "Forbidden: Only recruiter can create companies",
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
      jobs,
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

    // Lấy từ khóa tìm kiếm từ query
    const searchName = req.query.name || "";

    // Tạo query tìm kiếm
    const query = {};
    if (searchName) {
      query.name = { $regex: searchName, $options: "i" }; // Tìm kiếm không phân biệt hoa thường
    }

    // Lấy danh sách công ty với phân trang
    const companies = await Company.find(query).skip(skip).limit(limit);

    // Đếm số lượng công việc của từng công ty
    const companiesWithJobCount = await Promise.all(
      companies.map(async (company) => {
        const totalJobs = await Job.countDocuments({
          company_id: company.company_id,
        });
        return {
          ...company.toObject(),
          totalJobs,
        };
      })
    );

    // Tổng số công ty và số trang
    const totalCompanies = await Company.countDocuments(query);
    const totalPages = Math.ceil(totalCompanies / limit);

    res.status(200).json({
      companies: companiesWithJobCount,
      pagination: {
        totalCompanies,
        totalPages,
        currentPage: page,
        pageSize: limit,
      },
    });
  } catch (error) {
    console.error("Error fetching all companies:", error);
    res.status(500).json({ message: "Server error" });
  }
};


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
      return res.status(403).json({
        message: "Forbidden: Only recruiters can access this information",
      });
    }

    // Tìm công ty do người dùng này tạo ra
    const company = await Company.findOne({ created_by: user.user_id });
    if (!company) {
      return res
        .status(404)
        .json({ message: "Company not found for this user" });
    }

    res.status(200).json({ company });
  } catch (error) {
    console.error("Error fetching company by user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

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
      return res.status(403).json({
        message: "Forbidden: Only recruiters can update company information",
      });
    }

    // Tìm công ty do người dùng này tạo ra
    const company = await Company.findOne({ created_by: user.user_id });
    if (!company) {
      return res
        .status(404)
        .json({ message: "Company not found for this user" });
    }

    const { name, address, description, scale, web_url, phone } = req.body;

    if (name) company.name = name;
    if (address) company.address = address;
    if (description != null) company.description = description;
    if (scale) company.scale = scale;
    if (web_url) company.web_url = web_url;
    if (phone) company.phone = phone

    // Lưu các thay đổi vào cơ sở dữ liệu
    await company.save();

    res.status(200).json({ message: "Company updated successfully", company });
  } catch (error) {
    console.error("Error updating company:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.uploadLogo = async (req, res) => {
  try {
    const userEmail = req.user.email;

    // Find user and check role
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role_id !== 2) {
      return res
        .status(403)
        .json({ message: "Only recruiters can upload logos" });
    }

    // Find the company by `created_by`
    const company = await Company.findOne({ created_by: user.user_id });
    if (!company) {
      return res
        .status(404)
        .json({ message: "Company not found for this user" });
    }

    // Delete the previous logo if it exists
    if (company.logo) {
      const oldLogoPath = path.join(__dirname, "../../", company.logo);
      if (fs.existsSync(oldLogoPath)) {
        fs.unlinkSync(oldLogoPath);
      }
    }

    // Update company logo with new file path
    company.logo = `/uploads/${req.file.filename}`;
    await company.save();

    res
      .status(200)
      .json({ message: "Logo uploaded successfully", logo: company.logo });
  } catch (error) {
    console.error("Error uploading logo:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.dashboard = async (req, res) => {
  try {
    const userEmail = req.user.email;

    // Tìm recruiter từ email
    const user = await User.findOne({ email: userEmail });
    if (!user || user.role_id !== 2) {
      // Kiểm tra role_id để xác nhận recruiter
      return res.status(403).json({
        message: "Access denied. Only recruiters can access this dashboard.",
      });
    }

    // Lấy công ty mà recruiter này quản lý
    const company = await Company.findOne({ created_by: user.user_id });
    if (!company) {
      return res
        .status(404)
        .json({ message: "Company not found for this recruiter" });
    }

    // Thống kê
    const totalJobs = await Job.countDocuments({
      company_id: company.company_id,
    });
    const jobs = await Job.find({ company_id: company.company_id });
    const totalApplications = await JobApplication.countDocuments({
      job_id: { $in: jobs.map((job) => job.job_id) },
    });
    const openJobs = await Job.countDocuments({
      company_id: company.company_id,
      status: "OPEN",
    });
    const closedJobs = await Job.countDocuments({
      company_id: company.company_id,
      status: "CLOSED",
    });
    const rejectedJobs = await Job.countDocuments({
      company_id: company.company_id,
      status: "REJECTED",
    });

    const totalViews = await Job.aggregate([
      { $match: { company_id: company.company_id } },
      { $group: { _id: null, totalViews: { $sum: "$views" } } },
    ]);

    const totalLikes = await Job.aggregate([
      { $match: { company_id: company.company_id } },
      { $group: { _id: null, totalLikes: { $sum: "$like_number" } } },
    ]);

    // Lấy 5 công việc mới nhất
    const recentJobs = await Job.find({ company_id: company.company_id })
      .sort({ createdAt: -1 }) // Sắp xếp theo thời gian tạo, từ mới đến cũ
      .limit(5); // Lấy 5 công việc mới nhất

    // Tính ngày 2 tuần trước
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14); // Trừ đi 14 ngày

    // Đếm số lượng ứng viên ứng tuyển trong 2 tuần gần nhất
    const applicationsInLastTwoWeeks = await JobApplication.countDocuments({
      createdAt: { $gte: twoWeeksAgo },
      job_id: { $in: jobs.map((job) => job.job_id) }, // Lọc ứng viên ứng tuyển cho các công việc của công ty
    });

    // Trả về dữ liệu thống kê cho dashboard
    res.status(200).json({
      totalJobs,
      totalApplications,
      openJobs,
      closedJobs,
      rejectedJobs,
      totalViews: totalViews[0]?.totalViews || 0,
      totalLikes: totalLikes[0]?.totalLikes || 0,
      recentJobs, // Thêm 5 công việc mới nhất
      applicationsInLastTwoWeeks, // Thêm số ứng viên trong 2 tuần gần nhất
    });
  } catch (error) {
    console.error("Error fetching recruiter dashboard:", error);
    res.status(500).json({ message: "Server error" });
  }
};

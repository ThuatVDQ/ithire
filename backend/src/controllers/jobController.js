const Job = require("../models/Job");
const User = require("../models/User");
const Company = require("../models/Company");
const Address = require("../models/Address");
const Skill = require("../models/Skill");
const Category = require("../models/Category");
const JobApplication = require("../models/JobApplication");
const CV = require("../models/CV");
const { createNotification } = require("./notificationController");

//Dành cho recruiter
exports.createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      slots,
      type,
      experience,
      position,
      level,
      currency,
      salary_start,
      salary_end,
      requirement,
      benefit,
      deadline,
      categories,
      skills,
      addresses,
    } = req.body;

    const userEmail = req.user.email;
    const user = await User.findOne({ email: userEmail });
    const company = await Company.findOne({ created_by: user.user_id });

    if (!user || !company) {
      return res
        .status(404)
        .json({ message: "User or associated company not found" });
    }

    if (user.role_id !== 2) {
      return res
        .status(403)
        .json({ message: "Access denied. Only recruiters can create jobs." });
    }

    const category_ids = [];
    for (const name of categories) {
      let category = await Category.findOne({ name });
      if (!category) {
        category = new Category({ name });
        await category.save();
      }
      category_ids.push(category.category_id);
    }

    const skill_ids = [];
    for (const skillName of skills) {
      let skill = await Skill.findOne({ name: skillName });
      if (!skill) {
        skill = new Skill({ name: skillName });
        await skill.save();
      }
      skill_ids.push(skill.skill_id);
    }

    const address_ids = [];
    for (const addressData of addresses) {
      const { city, country, district, street } = addressData;
      let address = await Address.findOne({ city, country, district, street });
      if (!address) {
        address = new Address({ city, country, district, street });
        await address.save();
      }
      address_ids.push(address.address_id);
    }

    const newJob = new Job({
      title,
      description,
      slots,
      type,
      experience,
      position,
      level,
      currency,
      salary_start,
      salary_end,
      requirement,
      benefit,
      deadline,
      apply_number: 0,
      like_number: 0,
      views: 0,
      status: "PENDING",
      company_id: company.company_id,
      category_ids,
      skills: skill_ids,
      addresses: address_ids,
    });

    await newJob.save();
    message = `Job "${title}" has been created and is pending approval`;
    await createNotification(5, message);
    res.status(201).json({ message: "Job created successfully", job: newJob });
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getJobDetail = async (req, res) => {
  try {
    const { job_id } = req.params;

    // Tìm Job theo job_id
    const job = await Job.findOne({ job_id });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Tìm Company liên kết với Job
    const company = await Company.findOne({ company_id: job.company_id });

    const categories = await Category.find({
      category_id: { $in: job.category_ids },
    });

    // Tìm các Skill liên kết với Job
    const skills = await Skill.find({ skill_id: { $in: job.skills } });

    // Tìm các Address liên kết với Job
    const addresses = await Address.find({
      address_id: { $in: job.addresses },
    });

    // Trả về thông tin chi tiết của Job cùng với Company, Skills và Addresses
    res.status(200).json({
      job,
      company,
      skills,
      addresses,
      categories,
    });
  } catch (error) {
    console.error("Error fetching job detail:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//Dành cho recruiter
exports.getJobsByCompany = async (req, res) => {
  try {
    const userEmail = req.user.email;

    // Tìm user dựa trên email
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Tìm công ty dựa trên `created_by` trong Company
    const company = await Company.findOne({ created_by: user.user_id });
    if (!company) {
      return res
        .status(404)
        .json({ message: "Company not found for this user" });
    }

    // Lấy tham số phân trang
    const page = parseInt(req.query.page) || 1; // Trang hiện tại (mặc định là 1)
    const limit = parseInt(req.query.limit) || 10; // Số job trên mỗi trang (mặc định là 10)
    const search = req.query.search || ""; // Từ khóa tìm kiếm

    // Bộ lọc tìm kiếm
    const query = {
      company_id: company.company_id,
      title: { $regex: search, $options: "i" },
    };

    // Sử dụng aggregate để kết hợp Job với JobApplication
    const jobs = await Job.aggregate([
      { $match: query }, // Lọc công việc theo điều kiện
      {
        $lookup: {
          from: "jobapplications", // Tên collection JobApplication
          localField: "job_id",
          foreignField: "job_id",
          as: "applications",
        },
      },
      {
        $addFields: {
          applicationsCount: { $size: "$applications" }, // Thêm trường đếm số ứng viên
        },
      },
      { $sort: { createdAt: -1 } }, // Sắp xếp theo ngày tạo giảm dần
      { $skip: (page - 1) * limit }, // Bỏ qua các công việc không thuộc trang hiện tại
      { $limit: limit }, // Giới hạn số lượng công việc
    ]);

    // Đếm tổng số công việc
    const totalJobs = await Job.countDocuments(query);

    // Trả về dữ liệu
    res.status(200).json({
      jobs: jobs.map((job) => ({
        id: job.job_id,
        title: job.title,
        status: job.status,
        applications: job.applicationsCount, // Tổng số ứng dụng
        createdAt: job.createdAt, // Ngày tạo công việc
        type: job.type, // Thêm type công việc
        deadline: job.deadline, // Thêm deadline
        slots: job.slots, // Thêm số lượng vị trí tuyển dụng
      })),
      pagination: {
        totalJobs,
        totalPages: Math.ceil(totalJobs / limit),
        currentPage: page,
        pageSize: limit,
      },
    });
  } catch (error) {
    console.error("Error fetching jobs by company:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//Dành cho admin
exports.getJobsByStatus = async (req, res) => {
  try {
    // Kiểm tra quyền admin
    if (!req.user || req.user.role_id !== 1) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const { status } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Kiểm tra nếu `status` không được cung cấp
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    // Tìm các công việc dựa trên `status` và áp dụng phân trang
    const jobs = await Job.find({ status: status.toUpperCase() })
      .skip(skip)
      .limit(limit);
    const totalJobs = await Job.countDocuments({
      status: status.toUpperCase(),
    });
    const totalPages = Math.ceil(totalJobs / limit);

    // Lấy tên công ty và danh mục cho mỗi công việc
    const jobsWithDetails = await Promise.all(
      jobs.map(async (job) => {
        // Lấy tên công ty
        const company = await Company.findOne(
          { company_id: job.company_id },
          "name"
        );

        // Lấy tên danh mục thay vì ID
        const categories = await Category.find(
          { category_id: { $in: job.category_ids } },
          "name"
        );

        return {
          ...job.toObject(),
          companyName: company ? company.name : null,
          categories: categories.map((category) => category.name),
        };
      })
    );

    res.status(200).json({
      jobs: jobsWithDetails,
      pagination: {
        totalJobs,
        totalPages,
        currentPage: page,
        pageSize: limit,
      },
    });
  } catch (error) {
    console.error("Error fetching jobs by status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let user = null;
    let favoriteJobIds = [];
    let userId = null;

    // Thiết lập điều kiện truy vấn cho candidate và guest
    const query = { status: "OPEN" };

    // Kiểm tra nếu người dùng đã đăng nhập (candidate) và lấy thông tin user nếu có
    if (req.user && req.user.email) {
      const userEmail = req.user.email;
      user = await User.findOne({ email: userEmail });
      if (user) {
        favoriteJobIds = user.favorite_jobs || [];
        userId = user.user_id;
      }
    }

    // Lấy danh sách công việc với phân trang và điều kiện
    const jobs = await Job.find(query).skip(skip).limit(limit);
    const totalJobs = await Job.countDocuments(query);
    const totalPages = Math.ceil(totalJobs / limit);

    // Kiểm tra `isFavorite` và `apply_status` cho từng công việc (nếu người dùng đã đăng nhập)
    const jobsWithDetails = await Promise.all(
      jobs.map(async (job) => {
        let isFavorite = false;
        let apply_status = null;

        if (user) {
          // Nếu là candidate đã đăng nhập, xác định `isFavorite` và `apply_status`
          isFavorite = favoriteJobIds.includes(job.job_id);

          const application = await JobApplication.findOne({
            job_id: job.job_id,
            user_id: userId,
          });
          apply_status = application ? application.status : null;
        }

        // Lấy thêm thông tin kỹ năng, địa chỉ và logo, tên công ty
        const skills = await Skill.find(
          { skill_id: { $in: job.skills } },
          "name"
        );
        const addresses = await Address.find(
          { address_id: { $in: job.addresses } },
          "city"
        );
        const company = await Company.findOne(
          { company_id: job.company_id },
          "name logo"
        );

        return {
          ...job.toObject(),
          skills: skills.map((skill) => skill.name),
          addresses: addresses.map((address) => address.city),
          companyLogo: company ? company.logo : null,
          companyName: company ? company.name : null,
          isFavorite,
          apply_status,
        };
      })
    );

    res.status(200).json({
      jobs: jobsWithDetails,
      pagination: {
        totalJobs,
        totalPages,
        currentPage: page,
        pageSize: limit,
      },
    });
  } catch (error) {
    console.error("Error fetching all jobs:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.applyJob = async (req, res) => {
  try {
    const { job_id } = req.params;
    const email = req.user.email;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const user_id = user.user_id;

    // Check if the job exists
    const job = await Job.findOne({ job_id });
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check if the user has already applied
    const existingApplication = await JobApplication.findOne({
      job_id,
      user_id,
    });

    // Get company information to send notification to the recruiter
    const company = await Company.findOne({ company_id: job.company_id });
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    const recruiter_id = company.created_by;

    if (existingApplication) {
      if (!req.file) {
        return res.status(400).json({ message: "CV file is required" });
      }

      const cv = await CV.findOne({ cv_id: existingApplication.cv_id });
      cv.cv_url = req.file.filename;
      await cv.save();

      existingApplication.status = "IN_PROGRESS";
      await existingApplication.save();

      // Notification for re-application
      const message = `${user.full_name} has re-applied to the job: ${job.title}`;
      await createNotification(recruiter_id, message);

      res.status(201).json({
        message: "Job re-application submitted successfully",
        existingApplication,
      });
    } else {
      if (!req.file) {
        return res.status(400).json({ message: "CV file is required" });
      }

      const cv = new CV({
        cv_url: req.file.filename,
        user_id: user_id,
      });
      await cv.save();

      const cv_id = cv.cv_id;

      const application = new JobApplication({
        job_id,
        user_id,
        cv_id,
        status: "IN_PROGRESS",
      });

      await application.save();
      job.apply_number += 1;
      await job.save();

      // Notification for first-time application
      const message = `${user.full_name} has applied to the job: ${job.title}`;
      await createNotification(recruiter_id, message);

      res.status(201).json({
        message: "Job application submitted successfully",
        application,
      });
    }
  } catch (error) {
    console.error("Error applying for job:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Dành cho admin
exports.approveJob = async (req, res) => {
  try {
    const { job_id } = req.params;

    const job = await Job.findOne({ job_id });
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.status !== "PENDING") {
      return res.status(400).json({ message: "Job is not pending" });
    }
    job.status = "OPEN";
    await job.save();
    res.status(200).json({ message: "Job approved successfully", job });
  } catch (error) {
    console.error("Error approve job:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Dành cho admin
exports.rejectJob = async (req, res) => {
  try {
    const { job_id } = req.params;

    const job = await Job.findOne({ job_id });
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    if (job.status !== "PENDING") {
      return res.status(400).json({ message: "Job is not pending" });
    }

    // Update job status to REJECTED
    job.status = "REJECTED";
    await job.save();

    // Find the recruiter who created the job
    const company = await Company.findOne({ company_id: job.company_id });
    if (!company) {
      return res
        .status(404)
        .json({ message: "Company not found for this job" });
    }

    const recruiter_id = company.created_by; // Assuming `created_by` holds the recruiter ID

    // Create a notification for the recruiter
    const message = `"${job.title}" has been rejected.`;
    await createNotification(recruiter_id, message);

    res.status(200).json({ message: "Job rejected successfully", job });
  } catch (error) {
    console.error("Error rejecting job:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getFavoriteJobs = async (req, res) => {
  try {
    const userEmail = req.user.email;

    // Find user based on email
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get the list of favorite job IDs from `favorite_jobs`
    const favoriteJobIds = user.favorite_jobs;

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Find favorite jobs with pagination
    const favoriteJobs = await Job.find({ job_id: { $in: favoriteJobIds } })
        .skip(skip)
        .limit(limit);

    // Count total favorite jobs for pagination
    const totalFavoriteJobs = await Job.countDocuments({
      job_id: { $in: favoriteJobIds },
    });
    const totalPages = Math.ceil(totalFavoriteJobs / limit);

    // Add details for skills, addresses, company name, and logo
    const jobsWithDetails = await Promise.all(
        favoriteJobs.map(async (job) => {
          const skills = await Skill.find(
              { skill_id: { $in: job.skills } },
              "name"
          );
          const addresses = await Address.find(
              { address_id: { $in: job.addresses } },
              "city"
          );
          const company = await Company.findOne(
              { company_id: job.company_id },
              "name logo"
          );

          return {
            ...job.toObject(),
            skills: skills.map((skill) => skill.name), // List of skill names
            addresses: addresses.map((address) => address.city), // List of cities
            companyName: company ? company.name : null, // Company name
            companyLogo: company ? company.logo : null, // Company logo
          };
        })
    );

    // Send response with job details and pagination
    res.status(200).json({
      favoriteJobs: jobsWithDetails,
      pagination: {
        totalFavoriteJobs,
        totalPages,
        currentPage: page,
        pageSize: limit,
      },
    });
  } catch (error) {
    console.error("Error fetching favorite jobs:", error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.searchJobs = async (req, res) => {
  try {
    const { keyword, location, type } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let user = null;
    let favoriteJobIds = [];
    let userId = null;

    // Lấy thông tin người dùng nếu đã đăng nhập
    if (req.user && req.user.email) {
      const userEmail = req.user.email;
      user = await User.findOne({ email: userEmail });
      if (user) {
        favoriteJobIds = user.favorite_jobs || [];
        userId = user.user_id;
      }
    }

    // Xây dựng đối tượng truy vấn để tìm kiếm linh hoạt và chỉ lấy công việc có trạng thái "OPEN"
    let query = { status: "OPEN" };

    // Tìm kiếm theo tiêu đề (không phân biệt chữ hoa, chữ thường)
    if (keyword) {
      query.title = { $regex: keyword, $options: "i" };
    }

    // Tìm kiếm theo loại công việc
    if (type) {
      query.type = type;
    }

    // Nếu có location, cần tìm các địa chỉ phù hợp
    if (location) {
      const addresses = await Address.find({
        city: { $regex: location, $options: "i" },
      });
      const addressIds = addresses.map((address) => address.address_id);
      query.addresses = { $in: addressIds };
    }

    // Thực hiện truy vấn với phân trang
    const jobs = await Job.find(query).skip(skip).limit(limit);
    const totalJobs = await Job.countDocuments(query);
    const totalPages = Math.ceil(totalJobs / limit);

    // Thêm thông tin chi tiết cho từng công việc
    const jobsWithDetails = await Promise.all(
      jobs.map(async (job) => {
        let isFavorite = false;
        let apply_status = null;

        if (user) {
          // Nếu là candidate đã đăng nhập, xác định `isFavorite` và `apply_status`
          isFavorite = favoriteJobIds.includes(job.job_id);

          const application = await JobApplication.findOne({
            job_id: job.job_id,
            user_id: userId,
          });
          apply_status = application ? application.status : null;
        }

        // Lấy thêm thông tin kỹ năng, địa chỉ, logo công ty, và tên công ty
        const skills = await Skill.find(
          { skill_id: { $in: job.skills } },
          "name"
        );
        const addresses = await Address.find(
          { address_id: { $in: job.addresses } },
          "city"
        );
        const company = await Company.findOne(
          { company_id: job.company_id },
          "name logo"
        );

        return {
          ...job.toObject(),
          skills: skills.map((skill) => skill.name),
          addresses: addresses.map((address) => address.city),
          companyLogo: company ? company.logo : null,
          companyName: company ? company.name : null,
          isFavorite,
          apply_status,
        };
      })
    );

    // Trả về danh sách công việc với thông tin phân trang
    res.status(200).json({
      jobs: jobsWithDetails,
      pagination: {
        totalJobs,
        totalPages,
        currentPage: page,
        pageSize: limit,
      },
    });
  } catch (error) {
    console.error("Error searching jobs:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.searchJobsForRecruiter = async (req, res) => {
  try {
    const userEmail = req.user.email;

    // Tìm người dùng dựa trên email để xác thực vai trò recruiter
    const user = await User.findOne({ email: userEmail });
    if (!user || user.role_id !== 2) {
      return res.status(403).json({
        message: "Access denied. Only recruiters can access this search.",
      });
    }

    // Lấy công ty mà recruiter này tạo ra
    const company = await Company.findOne({ created_by: user.user_id });
    if (!company) {
      return res
        .status(404)
        .json({ message: "Company not found for this recruiter" });
    }

    const { title, location, type } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Xây dựng đối tượng truy vấn để tìm kiếm các công việc thuộc công ty của recruiter
    let query = { company_id: company.company_id };

    // Tìm kiếm theo tiêu đề công việc
    if (title) {
      query.title = { $regex: title, $options: "i" };
    }

    // Tìm kiếm theo loại công việc
    if (type) {
      query.type = type;
    }

    // Tìm kiếm theo vị trí (location)
    if (location) {
      const addresses = await Address.find({
        city: { $regex: location, $options: "i" },
      });
      const addressIds = addresses.map((address) => address.address_id);
      query.addresses = { $in: addressIds };
    }

    // Lấy danh sách công việc và sử dụng populate cho company và categories
    const jobs = await Job.find(query)
      .skip(skip)
      .limit(limit)
      .populate({ path: "categories", select: "name -_id -category_id" })
      .populate({ path: "address", select: "city -_id -address_id" });

    const totalJobs = await Job.countDocuments(query);
    const totalPages = Math.ceil(totalJobs / limit);

    // Trả về kết quả với công ty và danh mục đã được điền thông tin
    res.status(200).json({
      jobs,
      pagination: {
        totalJobs,
        totalPages,
        currentPage: page,
        pageSize: limit,
      },
    });
  } catch (error) {
    console.error("Error searching jobs for recruiter:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllForAdmin = async (req, res) => {
  try {
    // Kiểm tra quyền admin
    if (!req.user || req.user.role_id !== 1) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Lấy tất cả công việc và sử dụng populate cho công ty và danh mục
    const jobs = await Job.find()
      .skip(skip)
      .limit(limit)
      .populate({ path: "company", select: "name -_id -company_id" })
      .populate({ path: "categories", select: "name -_id -category_id" })
      .populate({ path: "address", select: "city -_id -address_id" });

    const totalJobs = await Job.countDocuments();
    const totalPages = Math.ceil(totalJobs / limit);

    // Trả về danh sách công việc với thông tin công ty và danh mục
    res.status(200).json({
      jobs,
      pagination: {
        totalJobs,
        totalPages,
        currentPage: page,
        pageSize: limit,
      },
    });
  } catch (error) {
    console.error("Error fetching all jobs for admin:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.searchJobsForAdmin = async (req, res) => {
  try {
    // Kiểm tra quyền admin
    if (!req.user || req.user.role_id !== 1) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const { title, location, type } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Xây dựng đối tượng truy vấn
    let query = {};

    // Tìm kiếm theo tiêu đề công việc
    if (title) {
      query.title = { $regex: title, $options: "i" };
    }

    // Tìm kiếm theo loại công việc
    if (type) {
      query.type = type;
    }

    // Tìm kiếm theo vị trí (location)
    if (location) {
      const addresses = await Address.find({
        city: { $regex: location, $options: "i" },
      });
      const addressIds = addresses.map((address) => address.address_id);
      query.addresses = { $in: addressIds };
    }

    // Lấy danh sách công việc và sử dụng populate cho công ty, danh mục và địa chỉ
    const jobs = await Job.find(query)
      .skip(skip)
      .limit(limit)
      .populate({ path: "company", select: "name -_id -company_id" })
      .populate({ path: "categories", select: "name -_id -category_id" })
      .populate({ path: "address", select: "city -_id -address_id" });

    const totalJobs = await Job.countDocuments(query);
    const totalPages = Math.ceil(totalJobs / limit);

    res.status(200).json({
      jobs,
      pagination: {
        totalJobs,
        totalPages,
        currentPage: page,
        pageSize: limit,
      },
    });
  } catch (error) {
    console.error("Error searching jobs for admin:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const { job_id } = req.params;
    const {
      title,
      description,
      slots,
      type,
      experience,
      position,
      level,
      currency,
      salary_start,
      salary_end,
      requirement,
      benefit,
      deadline,
      categories,
      skills,
      addresses,
    } = req.body;

    const role_id = req.user.role_id;
    if (role_id !== 2) {
      return res
        .status(403)
        .json({ message: "Access denied. Only recruiters can update jobs" });
    }

    const job = await Job.findOne({ job_id });
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    console.log(categories);
    const category_ids = [];
    for (const cat of categories) {
      let name;
      if (cat.name) {
        name = cat.name;
      } else {
        name = cat;
      }
      let category = await Category.findOne({ name });
      if (!category) {
        category = new Category({ name });
        await category.save();
      }
      category_ids.push(category.category_id);
    }

    const skill_ids = [];
    for (const skillName of skills) {
      let name;
      if (skillName.name) {
        name = skillName.name;
      } else {
        name = skillName;
      }
      let skill = await Skill.findOne({ name: name });
      if (!skill) {
        skill = new Skill({ name: skillName });
        await skill.save();
      }
      skill_ids.push(skill.skill_id);
    }

    const address_ids = [];
    for (const addressData of addresses) {
      const { city, country, district, street } = addressData;
      let address = await Address.findOne({ city, country, district, street });
      if (!address) {
        address = new Address({ city, country, district, street });
        await address.save();
      }
      address_ids.push(address.address_id);
    }

    job.title = title;
    job.description = description;
    job.slots = slots;
    job.type = type;
    job.experience = experience;
    job.position = position;
    job.level = level;
    job.currency = currency;
    job.salary_start = salary_start;
    job.salary_end = salary_end;
    job.requirement = requirement;
    job.benefit = benefit;
    job.deadline = deadline;
    job.category_ids = category_ids;
    job.skills = skill_ids;
    job.addresses = address_ids;

    await job.save();
    res.status(200).json({ message: "Job updated successfully", job });
  } catch (error) {
    console.error("Error updating job:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.closeJob = async (req, res) => {
  try {
    const { job_id } = req.params;

    const role_id = req.user.role_id;
    if (role_id !== 2 && role_id !== 1) {
      return res.status(403).json({
        message: "Access denied. Only recruiters or admins can close jobs",
      });
    }

    const job = await Job.findOne({ job_id });
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    job.status = "CLOSED";
    await job.save();
    res.status(200).json({ message: "Job closed successfully", job });
  } catch (error) {
    console.error("Error closing job:", error);
    res.status(500).json({ message: "Server error" });
  }
};

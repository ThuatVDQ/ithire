const Job = require("../models/Job");
const User = require("../models/User");
const Company = require("../models/Company");
const Address = require("../models/Address");
const Skill = require("../models/Skill");
const Category = require("../models/Category");
const JobApplication = require("../models/JobApplication");
const CV = require("../models/CV");

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
      category_names,
      skills,
      addresses,
    } = req.body;

    const userEmail = req.user.email;
    const user = await User.findOne({ email: userEmail });
    const company = await Company.findOne({ created_by: user.user_id });

    if (!user || !company) {
      return res.status(404).json({ message: "User or associated company not found" });
    }

    if (user.role_id !== 2) {
      return res.status(403).json({ message: "Access denied. Only recruiters can create jobs." });
    }

    const category_ids = [];
    for (const name of category_names) {
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

    // Tìm các Skill liên kết với Job
    const skills = await Skill.find({ skill_id: { $in: job.skills } });

    // Tìm các Address liên kết với Job
    const addresses = await Address.find({ address_id: { $in: job.addresses } });

    // Trả về thông tin chi tiết của Job cùng với Company, Skills và Addresses
    res.status(200).json({
      job,
      company,
      skills,
      addresses,
    });
  } catch (error) {
    console.error("Error fetching job detail:", error);
    res.status(500).json({ message: "Server error" });
  }
};

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

    // Lấy tất cả công việc của công ty
    const jobs = await Job.find({ company_id: company.company_id });

    res.status(200).json({ jobs });
  } catch (error) {
    console.error("Error fetching jobs by company:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getJobsByStatus = async (req, res) => {
  try {
    const { status } = req.params;

    // Kiểm tra nếu `status` không được cung cấp
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    // Tìm các công việc dựa trên `status`
    const jobs = await Job.find({ status: status.toUpperCase() });

    res.status(200).json({ jobs });
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

    // Lấy danh sách công việc với phân trang
    const jobs = await Job.find().skip(skip).limit(limit);
    const totalJobs = await Job.countDocuments();
    const totalPages = Math.ceil(totalJobs / limit);

    // Thêm thông tin `city`, `name` của `Skill`, và `logo` của `Company`
    const jobsWithDetails = await Promise.all(
      jobs.map(async (job) => {
        const skills = await Skill.find({ skill_id: { $in: job.skills } }, 'name');
        const addresses = await Address.find({ address_id: { $in: job.addresses } }, 'city');
        const company = await Company.findOne({ company_id: job.company_id }, 'logo');

        return {
          ...job.toObject(),
          skills: skills.map(skill => skill.name), 
          addresses: addresses.map(address => address.city), 
          companyLogo: company ? company.logo : null, 
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
    // Kiểm tra xem công việc có tồn tại không
    const job = await Job.findOne({ job_id });
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Kiểm tra xem người dùng đã ứng tuyển chưa
    const existingApplication = await JobApplication.findOne({
      job_id,
      user_id,
    });

    if (existingApplication) {
      if (!req.file) {
        return res.status(400).json({ message: "CV file is required" });
      }

      const cv = await CV.findOne({ cv_id: existingApplication.cv_id });
      cv.cv_url = req.file.filename;
      cv.save();

      existingApplication.status = "IN_PROGRESS";
      existingApplication.save();

      res.status(201).json({
        message: "Job application submitted successfully",
        existingApplication,
      });
    } else {
      // Kiểm tra file CV có được tải lên hay không
      if (!req.file) {
        return res.status(400).json({ message: "CV file is required" });
      }

      const cv = new CV({
        cv_url: req.file.filename,
        user_id: user_id,
      });
      await cv.save();
      // Lấy tên file từ `uploadMiddleware`
      const cv_id = cv.cv_id;

      // Tạo mới bản ghi ứng tuyển với CV
      const application = new JobApplication({
        job_id,
        user_id,
        cv_id,
        status: "IN_PROGRESS",
      });

      await application.save();
      job.apply_number += 1;
      job.save();
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
    job.status = "REJECTED";
    await job.save();
    res.status(200).json({ message: "Job rejected successfully", job });
  } catch (error) {
    console.error("Error reject job:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getFavoriteJobs = async (req, res) => {
  try {
    const userEmail = req.user.email;

    // Tìm user dựa trên email
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Lấy danh sách công việc yêu thích từ `favorite_jobs`
    const favoriteJobIds = user.favorite_jobs;

    // Thêm phân trang
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Tìm các công việc yêu thích có phân trang
    const favoriteJobs = await Job.find({ job_id: { $in: favoriteJobIds } })
                                  .skip(skip)
                                  .limit(limit);

    // Tính tổng số công việc yêu thích để xác định tổng số trang
    const totalFavoriteJobs = await Job.countDocuments({ job_id: { $in: favoriteJobIds } });
    const totalPages = Math.ceil(totalFavoriteJobs / limit);

    // Truy vấn để lấy tên các kỹ năng, thành phố, và logo của công ty cho từng công việc yêu thích
    const jobsWithDetails = await Promise.all(
      favoriteJobs.map(async (job) => {
        const skills = await Skill.find({ skill_id: { $in: job.skills } }, 'name');
        const addresses = await Address.find({ address_id: { $in: job.addresses } }, 'city');
        const company = await Company.findOne({ company_id: job.company_id }, 'logo');

        return {
          ...job.toObject(),
          skills: skills.map(skill => skill.name),
          addresses: addresses.map(address => address.city),
          companyLogo: company ? company.logo : null, // Logo của công ty (nếu có)
        };
      })
    );

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
    const { title, location, type } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;


    // Xây dựng đối tượng truy vấn để tìm kiếm linh hoạt
    let query = {};

    // Tìm kiếm theo tiêu đề (không phân biệt chữ hoa, chữ thường)
    if (title) {
      query.title = { $regex: title, $options: 'i' };
    }

    // Tìm kiếm theo loại công việc
    if (type) {
      query.type = type;
    }

    // Nếu có location, cần tìm các địa chỉ phù hợp
    if (location) {
      const addresses = await Address.find({ city: { $regex: location, $options: 'i' } });
      const addressIds = addresses.map((address) => address.address_id);
      query.addresses = { $in: addressIds };
    }

    // Thực hiện truy vấn với phân trang
    const jobs = await Job.find(query).skip(skip).limit(limit);
    const totalJobs = await Job.countDocuments(query);
    const totalPages = Math.ceil(totalJobs / limit);

    // Thêm thông tin kỹ năng, thành phố, và logo công ty cho từng công việc
    const jobsWithDetails = await Promise.all(
      jobs.map(async (job) => {
        const skills = await Skill.find({ skill_id: { $in: job.skills } }, 'name');
        const addresses = await Address.find({ address_id: { $in: job.addresses } }, 'city');
        const company = await Company.findOne({ company_id: job.company_id }, 'logo');

        return {
          ...job.toObject(),
          skills: skills.map(skill => skill.name),
          addresses: addresses.map(address => address.city),
          companyLogo: company ? company.logo : null,
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
      return res.status(403).json({ message: "Access denied. Only recruiters can access this search." });
    }

    // Lấy công ty mà recruiter này tạo ra
    const company = await Company.findOne({ created_by: user.user_id });
    if (!company) {
      return res.status(404).json({ message: "Company not found for this recruiter" });
    }

    const { title, location, type } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Xây dựng đối tượng truy vấn để tìm kiếm các công việc thuộc công ty của recruiter
    let query = { company_id: company.company_id };

    // Tìm kiếm theo tiêu đề công việc
    if (title) {
      query.title = { $regex: title, $options: 'i' };
    }

    // Tìm kiếm theo loại công việc
    if (type) {
      query.type = type;
    }

    // Tìm kiếm theo vị trí (location)
    if (location) {
      const addresses = await Address.find({ city: { $regex: location, $options: 'i' } });
      const addressIds = addresses.map((address) => address.address_id);
      query.addresses = { $in: addressIds };
    }

    // Thực hiện truy vấn và phân trang
    const jobs = await Job.find(query).skip(skip).limit(limit);
    const totalJobs = await Job.countDocuments(query);
    const totalPages = Math.ceil(totalJobs / limit);

    // Thêm thông tin chi tiết kỹ năng, địa chỉ và logo công ty
    const jobsWithDetails = await Promise.all(
      jobs.map(async (job) => {
        const skills = await Skill.find({ skill_id: { $in: job.skills } }, 'name');
        const addresses = await Address.find({ address_id: { $in: job.addresses } }, 'city');
        const company = await Company.findOne({ company_id: job.company_id }, 'logo');

        return {
          ...job.toObject(),
          skills: skills.map(skill => skill.name),
          addresses: addresses.map(address => address.city),
          companyLogo: company ? company.logo : null,
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
    console.error("Error searching jobs for recruiter:", error);
    res.status(500).json({ message: "Server error" });
  }
};

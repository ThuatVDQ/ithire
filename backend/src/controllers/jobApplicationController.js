const JobApplication = require("../models/JobApplication");
const CV = require("../models/CV");
const User = require("../models/User");
const Job = require("../models/Job");
const Company = require("../models/Company");
const Notification = require("../controllers/notificationController");
const path = require("path");
const fs = require("fs");
exports.downloadCV = async (req, res) => {
  try {
    const { job_id } = req.params;
    const jobApplications = await JobApplication.find({ job_id });
    if (!jobApplications || jobApplications.length === 0) {
      return res
        .status(404)
        .json({ message: "No applications found for this job" });
    }

    const cvIds = jobApplications.map((app) => app.cv_id);

    const cvs = await CV.find({ cv_id: { $in: cvIds } });

    if (!cvs || cvs.length === 0) {
      return res.status(404).json({ message: "No CVs found for this job" });
    }

    const cvPaths = cvs.map((cv) =>
      path.join(__dirname, "../../uploads", cv.cv_url)
    );

    const zip = require("archiver")("zip");
    res.attachment(`cvs_${job_id}.zip`);
    const archive = zip;

    archive.pipe(res);

    for (const cvPath of cvPaths) {
      if (fs.existsSync(cvPath)) {
        archive.file(cvPath, { name: path.basename(cvPath) });
      }
    }
    for (const jobApplication of jobApplications) {
      if (jobApplication.status === "IN_PROGRESS") {
        jobApplication.status = "SEEN";
        jobApplication.save();
      }
    }

    archive.finalize();
  } catch (error) {
    console.error("Error download cv:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getJobApplicationsByJobId = async (req, res) => {
  try {
    const userRoleId = req.user.role_id;
    const jobId = Number(req.params.job_id); // Đảm bảo job_id là số
    const page = parseInt(req.query.page, 10) || 1; // Trang hiện tại, mặc định là 1
    const limit = parseInt(req.query.limit, 10) || 10; // Số bản ghi mỗi trang, mặc định là 10
    const skip = (page - 1) * limit;

    // Xác minh quyền truy cập
    if (userRoleId !== 2) {
      return res.status(403).json({
        message: "Access denied. Only recruiters can access this resource.",
      });
    }

    // Lấy thông tin công việc (để lấy `title`)
    const job = await Job.findOne({ job_id: jobId });
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Tìm các ứng dụng cho công việc cụ thể với phân trang
    const applications = await JobApplication.find({ job_id: jobId })
      .skip(skip)
      .limit(limit)
      .populate({ path: "user", select: "full_name email phone" })
      .populate({ path: "cv", select: "cv_url" });

    // Đếm tổng số ứng dụng
    const totalApplications = await JobApplication.countDocuments({
      job_id: jobId,
    });
    const totalPages = Math.ceil(totalApplications / limit);

    // Trả về kết quả
    res.status(200).json({
      job: {
        job_id: jobId,
        title: job.title, // Thêm tiêu đề công việc
      },
      applications: applications.map((app) => ({
        id: app.job_application_id,
        cv_id: app.cv_id, // CV ID
        user: app.user,
        cv_url: app.cv.cv_url,
        status: app.status,
        createdAt: app.createdAt,
      })),
      pagination: {
        totalApplications,
        totalPages,
        currentPage: page,
        pageSize: limit,
      },
    });
  } catch (error) {
    console.error("Error fetching job applications:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.changeApplicationStatus = async (req, res) => {
  try {
    const userRoleId = req.user.role_id;
    const application_id = Number(req.params.job_application_id);
    const { newStatus } = req.body;

    // Check if the user is a recruiter
    if (userRoleId !== 2) {
      return res.status(403).json({
        message:
          "Access denied. Only recruiters can change the application status.",
      });
    }

    // Get application details
    const application = await JobApplication.findOne({
      job_application_id: application_id,
    });
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Check for valid status transitions
    if (application.status === "IN_PROGRESS" && newStatus === "SEEN") {
      application.status = "SEEN";
    } else if (
      application.status === "SEEN" &&
      (newStatus === "ACCEPTED" || newStatus === "REJECTED")
    ) {
      application.status = newStatus;
    } else {
      return res.status(400).json({ message: "Invalid status transition" });
    }

    await application.save();

    // Create a notification if the new status is "ACCEPTED"
    if (newStatus === "ACCEPTED") {
      const user = await User.findOne({ user_id: application.user_id });
      if (user) {
        const job = await Job.findOne({ job_id: application.job_id });
        const message = `Your application for the job ${job.title} has been accepted.`;
        await Notification.createNotification(application.user_id, message);
      }
    }

    res
      .status(200)
      .json({ message: "Application status updated successfully" });
  } catch (error) {
    console.error("Error changing application status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.checkJobApplication = async (req, res) => {
  try {
    const { job_id } = req.params;
    const email = req.user.email;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const application = await JobApplication.findOne({
      job_id,
      user_id: user.user_id,
    });

    if (application) {
      return res.status(200).json({
        applied: true,
        applicationId: application.application_id,
        status: application.status,
      });
    }

    return res.status(200).json({ applied: false });
  } catch (error) {
    console.error("Error checking job application:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUserApplications = async (req, res) => {
  try {
    const email = req.user.email;

    // Find the user based on email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find all job applications for the user based on `user_id`
    const jobApplications = await JobApplication.find({
      user_id: user.user_id,
    });

    if (!jobApplications || jobApplications.length === 0) {
      return res.status(404).json({ message: "No job applications found." });
    }

    // Extract `job_id` and `cv_id` from the applications
    const jobIds = jobApplications.map((app) => app.job_id);
    const cvIds = jobApplications.map((app) => app.cv_id);

    // Fetch job and CV data
    const jobs = await Job.find({ job_id: { $in: jobIds } }).select(
      "job_id title description company_id"
    );
    const cvs = await CV.find({ cv_id: { $in: cvIds } }).select("cv_id cv_url");

    // Fetch company data if needed
    const companyIds = jobs.map((job) => job.company_id);
    const companies = await Company.find({
      company_id: { $in: companyIds },
    }).select("company_id name logo");

    // Map data into job applications
    const applications = jobApplications.map((app) => {
      const job = jobs.find((job) => job.job_id === app.job_id);
      const cv = cvs.find((cv) => cv.cv_id === app.cv_id);
      const company = job
        ? companies.find((comp) => comp.company_id === job.company_id)
        : null;

      return {
        application_id: app.job_application_id,
        job_id: app.job_id, // Include `job_id`
        status: app.status,
        createdAt: app.createdAt,
        updatedAt: app.updatedAt,
        job: job
          ? {
              job_id: job.job_id, // Include `job_id`
              title: job.title,
              description: job.description,
              company: company
                ? {
                    company_id: company.company_id, // Include `company_id`
                    name: company.name,
                    logo: company.logo,
                  }
                : null,
            }
          : null,
        cv: cv ? { url: cv.cv_url } : null,
      };
    });

    res.status(200).json({ applications });
  } catch (error) {
    console.error("Error fetching user applications:", error);
    res.status(500).json({ message: "Server error" });
  }
};

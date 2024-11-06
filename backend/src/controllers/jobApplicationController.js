const JobApplication = require("../models/JobApplication");
const CV = require("../models/CV");
const User = require("../models/User");
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
    const jobId = Number(req.params.job_id); // Ensure job_id is a number
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Fetch job applications with pagination
    const applications = await JobApplication.find({ job_id: jobId })
      .skip(skip)
      .limit(limit)
      .populate({ path: "user", select: "full_name" }) // Example populate for user details

    const totalApplications = await JobApplication.countDocuments({ job_id: jobId });
    const totalPages = Math.ceil(totalApplications / limit);

    res.status(200).json({
      applications,
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
    const userRoleId = req.user.role_id; // role_id lấy từ token qua middleware verifyToken
    const  application_id  = Number(req.params.job_application_id);
    const { newStatus } = req.body;

    // Kiểm tra xem người dùng có phải là recruiter không
    if (userRoleId !== 2) {
      return res.status(403).json({ message: "Access denied. Only recruiters can change the application status." });
    }

    // Lấy thông tin của application
    console.log(application_id);
    const application = await JobApplication.findOne({ job_application_id: application_id });
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Kiểm tra điều kiện thay đổi trạng thái
    if (application.status === "IN_PROGRESS" && newStatus === "SEEN") {
      application.status = "SEEN";
    } else if (application.status === "SEEN" && (newStatus === "ACCEPTED" || newStatus === "REJECTED")) {
      application.status = newStatus;
    } else {
      return res.status(400).json({ message: "Invalid status transition" });
    }

    await application.save();
    res.status(200).json({ message: "Application status updated successfully" });
  } catch (error) {
    console.error("Error changing application status:", error);
    res.status(500).json({ message: "Server error" });
  }
};
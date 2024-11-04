const JobApplication = require("../models/JobApplication");
const CV = require("../models/CV");
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

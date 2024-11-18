const JobApplication = require("../models/JobApplication");
const CV = require("../models/CV");
const path = require("path");
const fs = require("fs");

exports.downloadCV = async (req, res) => {
  try {
    const { cv_id } = req.params;

    const cv = await CV.findOne({ cv_id: cv_id });
    if (!cv) {
      return res.status(404).json({ message: "CV not found" });
    }

    const cvPath = path.join(__dirname, "../../uploads", cv.cv_url);
    if (!fs.existsSync(cvPath)) {
      return res.status(404).json({ message: "CV file not found" });
    }

    res.download(cvPath, cv.cv_url, (err) => {
      if (err) {
        console.error("Error sending CV file:", err);
        res.status(500).json({ message: "Error downloading CV file" });
      }
    });

    const jobApplication = await JobApplication.findOne({ cv_id });
    if (jobApplication.status === "IN_PROGRESS") {
      jobApplication.status = "SEEN";
      await jobApplication.save();
    }
  } catch (error) {
    console.error("Error downloading CV:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.viewCV = async (req, res) => {
  try {
    const uploadsDir = path.resolve(__dirname, "../../uploads");
    const filePath = path.resolve(uploadsDir, req.params.filename);

    if (!filePath.startsWith(uploadsDir)) {
      return res.status(403).json({ message: "Access denied." });
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found." });
    }

    res.sendFile(filePath);
  } catch (error) {
    console.error("Error accessing CV:", error);
    res.status(500).json({ message: "Failed to access CV." });
  }
};

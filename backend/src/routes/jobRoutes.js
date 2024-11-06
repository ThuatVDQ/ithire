const express = require("express");
const router = express.Router();
const jobController = require("../controllers/jobController");
const verifyToken = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { validateCVFileType } = require("../middleware/validationMiddleware");

router.post("/create", verifyToken, jobController.createJob);

router.get("/detail/:job_id", jobController.getJobDetail);

router.get("/company", verifyToken, jobController.getJobsByCompany);

router.get("/:status", jobController.getJobsByStatus);

router.get("/", jobController.getAll);

router.post(
  "/apply/:job_id",
  verifyToken,
  upload.single("cv"),
  validateCVFileType,
  jobController.applyJob
);

router.post("/:job_id/approve", verifyToken, jobController.approveJob);

router.post("/:job_id/reject", verifyToken, jobController.rejectJob);

router.get("/recruiter/search", verifyToken, jobController.searchJobsForRecruiter);

router.get("/user/search", jobController.searchJobs);

router.get("/user/my-favorites", verifyToken, jobController.getFavoriteJobs);

module.exports = router;

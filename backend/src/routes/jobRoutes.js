const express = require("express");
const router = express.Router();
const jobController = require("../controllers/jobController");
const verifyToken = require("../middleware/authMiddleware");
const optionalAuthenticate = require("../middleware/optionalAuthMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { validateCVFileType } = require("../middleware/validationMiddleware");

router.post("/", verifyToken, jobController.createJob);

router.get("/:job_id", jobController.getJobDetail);

router.get("/:status", verifyToken,jobController.getJobsByStatus);

router.get("/", optionalAuthenticate, jobController.getAll);

router.post(
  "/apply/:job_id",
  verifyToken,
  upload.single("cv"),
  validateCVFileType,
  jobController.applyJob
);

router.get("/search", optionalAuthenticate,jobController.searchJobs);

router.get("/my-favorites", verifyToken, jobController.getFavoriteJobs);

module.exports = router;

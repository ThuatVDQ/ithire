const express = require("express");
const router = express.Router();
const jobController = require("../controllers/jobController");
const verifyToken = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { validateCVFileType } = require("../middleware/validationMiddleware");

router.post("/create", verifyToken, jobController.createJob);

router.get("/detail/:job_id", jobController.getJobDetail);

router.get("/company", verifyToken, jobController.getJobsByCompany);

router.get("/:status", verifyToken,jobController.getJobsByStatus);

router.get("/candidates/getAll", (req, res, next) => {
  const token = req.headers["authorization"];
  
  // Nếu có token, tiến hành xác thực
  if (token) {
    verifyToken(req, res, (err) => {
      if (err) {
        req.user = null;
      }
      next();
    });
  } else {
    // Nếu không có token, tiếp tục không cần xác thực
    req.user = null;
    next();
  }
}, jobController.getAll);

router.get("/admin/getAll", verifyToken, jobController.getAllForAdmin);


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

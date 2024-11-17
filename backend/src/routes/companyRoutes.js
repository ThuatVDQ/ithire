const express = require("express");
const router = express.Router();
const companyController = require("../controllers/companyController");
const {
  validateCompanyCreation,
} = require("../middleware/validationMiddleware");
const verifyToken = require("../middleware/authMiddleware");
const { validateAvatarFileType } = require("../middleware/validationMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.post(
  "/",
  verifyToken,
  validateCompanyCreation,
  companyController.createCompany
);

router.get("/:company_id", companyController.getCompanyDetail);

router.get("/", companyController.getAll)

router.post("/upload-logo", verifyToken, upload.single("logo"), validateAvatarFileType, companyController.uploadLogo);

module.exports = router;

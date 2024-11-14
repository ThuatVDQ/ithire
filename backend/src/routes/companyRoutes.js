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
  "/create",
  verifyToken,
  validateCompanyCreation,
  companyController.createCompany
);

router.get("/detail/:company_id", companyController.getCompanyDetail);

router.get("/", companyController.getAll)

router.get("/info", verifyToken, companyController.getCompanyByUser);

router.put("/update", verifyToken, companyController.updateCompany);

router.post("/upload-logo", verifyToken, upload.single("logo"), validateAvatarFileType, companyController.uploadLogo);

router.get("/dashboard", verifyToken, companyController.dashboard);

module.exports = router;

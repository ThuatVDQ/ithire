const { body } = require("express-validator");

const validateSignup = [
  body("email").isEmail().withMessage("Email is not valid"),
  body("full_name").notEmpty().withMessage("Full name is not blank"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6"),
  body("retypePassword")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Retype password is not match"),
];

const fs = require("fs");

// Middleware kiểm tra loại file cho avatar (chỉ cho phép ảnh)
const validateAvatarFileType = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];
  if (!allowedMimeTypes.includes(req.file.mimetype)) {
    fs.unlinkSync(req.file.path); // Xóa file không hợp lệ
    return res.status(400).json({ message: "Invalid file type for avatar. Only images are allowed." });
  }

  next(); // Tiếp tục nếu file hợp lệ
};

// Middleware kiểm tra loại file cho CV (chỉ cho phép PDF)
const validateCVFileType = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  if (req.file.mimetype !== "application/pdf") {
    fs.unlinkSync(req.file.path); // Xóa file không hợp lệ
    return res.status(400).json({ message: "Invalid file type for CV. Only PDFs are allowed." });
  }

  next(); // Tiếp tục nếu file hợp lệ
};

module.exports = {
  validateSignup, validateAvatarFileType, validateCVFileType
};

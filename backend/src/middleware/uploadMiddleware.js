const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

// Tạo thư mục uploads nếu chưa tồn tại
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình lưu trữ của multer để lưu tất cả file vào `uploads`
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Lưu file vào thư mục uploads
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const randomName = crypto.randomBytes(16).toString("hex"); // Tạo chuỗi ngẫu nhiên
    cb(null, `${randomName}${ext}`); // Tên file là chuỗi ngẫu nhiên + phần đuôi
  },
});

const upload = multer({ storage });

module.exports = upload;

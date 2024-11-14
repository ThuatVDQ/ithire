const jwt = require("jsonwebtoken");

const optionalAuthenticate = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    // Không có token, gán `req.user` là null và tiếp tục
    req.user = null;
    return next();
  }

  // Nếu có token, xác thực như `verifyToken`
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      console.log("Optional authentication failed:", err);
      req.user = null; // Token không hợp lệ, đặt `req.user` là null
    } else {
      req.user = decoded; // Token hợp lệ, gán thông tin user vào `req.user`
    }
    next();
  });
};

module.exports = optionalAuthenticate;

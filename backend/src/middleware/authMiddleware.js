const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");
  if (!token) return res.status(403).json({ error: "Access denied!" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = verified;
    next();
  } catch (error) {
    console.log("Error verifying token:", error);
    res.status(400).json({ error: "Invalid token!" });
  }
};

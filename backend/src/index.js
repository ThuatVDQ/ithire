const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./configs/db");

const app = express();
const port = process.env.PORT || 3000;

connectDB();

const allowedOrigins = ["http://localhost:3000"]; 
app.use(cors({
  origin: function (origin, callback) {
    // Cho phép truy cập từ các miền trong allowedOrigins hoặc không có origin (dành cho công cụ như Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
}));

app.use(express.json());

const authRoutes = require("./routes/authRoutes");
const roleRoutes = require("./routes/roleRoutes");
const companyRoutes = require("./routes/companyRoutes");
const jobRoutes = require("./routes/jobRoutes");
const jobApplicationRoutes = require("./routes/jobApplicationRoutes");
const cvRoutes = require("./routes/cvRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

app.use("/api/jobs", jobRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/job-applications", jobApplicationRoutes);
app.use("/api/cvs", cvRoutes);
app.use("/api/notifications", notificationRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

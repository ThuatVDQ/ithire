const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const connectDB = require("./configs/db");

const app = express();
const port = process.env.PORT || 3000;

connectDB();

app.use(express.json());

const authRoutes = require("./routes/authRoutes");
const roleRoutes = require("./routes/roleRoutes");
const companyRoutes = require('./routes/companyRoutes');
const jobRoutes = require("./routes/jobRoutes");
const favoriteJobRoutes = require("./routes/favoriteJobRoutes");

app.use("/api/jobs", jobRoutes);
app.use('/api/companies', companyRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/favorite-jobs", favoriteJobRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

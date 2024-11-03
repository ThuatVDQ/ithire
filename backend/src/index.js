const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const connectDB = require("./configs/db");

const app = express();
const port = process.env.PORT || 3000;

connectDB();

app.use(express.json());

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

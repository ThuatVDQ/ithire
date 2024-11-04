const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = "mongodb://localhost:27017/ithire";
    // const uri = process.env.MONGODB_URI;
    console.log(uri);
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;

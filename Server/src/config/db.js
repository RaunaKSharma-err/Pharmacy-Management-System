const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongooseURI = await process.env.MONGODB_URI;
    mongoose.connect(mongooseURI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Mongo DB error", error);
    process.exit(1);
  }
};

module.exports = connectDB;

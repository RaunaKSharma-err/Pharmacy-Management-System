// Create user model here based on your requirements and the database using ORMs and ODMsconst mongoose = require("mongoose");
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ["admin", "staff"], default: "staff" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);

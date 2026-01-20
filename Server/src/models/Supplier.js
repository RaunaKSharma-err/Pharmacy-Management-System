const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema({
  name: String,
  contact: String,
  email: String,
  address: String,
});

module.exports = mongoose.model("Supplier", supplierSchema);

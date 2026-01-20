const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema(
  {
    name: String,
    category: String,
    batchNumber: String,
    expiryDate: Date,
    quantity: Number,
    purchasePrice: Number,
    sellingPrice: Number,
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Medicine", medicineSchema);

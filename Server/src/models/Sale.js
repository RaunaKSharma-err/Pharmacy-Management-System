const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema(
  {
    medicines: [
      {
        medicine: { type: mongoose.Schema.Types.ObjectId, ref: "Medicine" },
        quantity: Number,
        price: Number,
      },
    ],
    totalAmount: Number,
    soldBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Sale", saleSchema);

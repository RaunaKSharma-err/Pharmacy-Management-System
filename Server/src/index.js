require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

connectDB();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/medicines", require("./routes/medicineRoutes"));
app.use("/api/sales", require("./routes/saleRoutes"));
app.use("/api/suppliers", require("./routes/supplierRoutes"));

app.get("/", (req, res) => {
  res.status(200).json({ message: "Good Health" });
});

app.listen(5000, () => console.log("Server running on port 5000"));

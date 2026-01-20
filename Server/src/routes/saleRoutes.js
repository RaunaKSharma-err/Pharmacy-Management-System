const router = require("express").Router();
const auth = require("../middlewares/authMiddleware");
const { createSale } = require("../controllers/saleController");

// All sales require authentication
router.use(auth);

// Create a sale
router.post("/", createSale);

// Get all sales (admin only)
router.get("/", async (req, res) => {
  try {
    const sales = await require("../models/Sale")
      .find()
      .populate("soldBy", "name email")
      .populate("medicines.medicine", "name");
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

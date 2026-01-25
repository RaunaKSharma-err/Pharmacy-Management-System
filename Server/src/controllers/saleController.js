const Sale = require("../models/Sale");
const Medicine = require("../models/Medicine");

exports.createSale = async (req, res) => {
  const { items } = req.body;

  let total = 0;
  for (const item of items) {
    const med = await Medicine.findById(item.medicineId);
    if (med.quantity < item.quantity)
      return res.status(400).json({ message: "Insufficient stock" });

    med.quantity -= item.quantity;
    await med.save();

    total += item.unitPrice * item.quantity;
  }

  const sale = await Sale.create({
    items,
    totalAmount: total,
    soldBy: req.user.id,
  });

  res.json(sale);
};

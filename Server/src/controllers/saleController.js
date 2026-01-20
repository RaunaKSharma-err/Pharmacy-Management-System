const Sale = require("../models/Sale");
const Medicine = require("../models/Medicine");

exports.createSale = async (req, res) => {
  const { medicines } = req.body;

  let total = 0;
  for (const item of medicines) {
    const med = await Medicine.findById(item.medicine);
    if (med.quantity < item.quantity)
      return res.status(400).json({ message: "Insufficient stock" });

    med.quantity -= item.quantity;
    await med.save();

    total += item.price * item.quantity;
  }

  const sale = await Sale.create({
    medicines,
    totalAmount: total,
    soldBy: req.user.id,
  });

  res.json(sale);
};

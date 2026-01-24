const Medicine = require("../models/Medicine");

exports.createMedicine = async (req, res) => {
  const medicine = await Medicine.create(req.body);
  res.json(medicine);
};

exports.getMedicines = async (req, res) => {
  const medicines = await Medicine.find().populate("supplier");
  console.log(medicines);
  res.json(medicines);
};

exports.updateMedicine = async (req, res) => {
  const medicine = await Medicine.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(medicine);
};

exports.deleteMedicine = async (req, res) => {
  await Medicine.findByIdAndDelete(req.params.id);
  res.json({ message: "Medicine deleted" });
};

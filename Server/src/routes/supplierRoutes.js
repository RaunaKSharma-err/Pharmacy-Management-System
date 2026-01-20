const router = require("express").Router();
const auth = require("../middlewares/authMiddleware");
const role = require("../middlewares/roleMiddleware");
const supplierCtrl = require("../controllers/supplierController");

// All supplier routes require login
router.use(auth);

// Create supplier (admin only)
router.post("/", role(["admin"]), supplierCtrl.createSupplier);

// Read suppliers
router.get("/", supplierCtrl.getSuppliers);
router.get("/:id", supplierCtrl.getSupplierById);

// Update supplier (admin only)
router.put("/:id", role(["admin"]), supplierCtrl.updateSupplier);

// Delete supplier (admin only)
router.delete("/:id", role(["admin"]), supplierCtrl.deleteSupplier);

module.exports = router;

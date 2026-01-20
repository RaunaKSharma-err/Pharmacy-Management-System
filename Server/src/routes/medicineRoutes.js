const router = require("express").Router();
const auth = require("../middlewares/authMiddleware");
const role = require("../middlewares/roleMiddleware");
const ctrl = require("../controllers/medicineControlller");

router.use(auth);
router.post("/", role(["admin"]), ctrl.createMedicine);
router.get("/", ctrl.getMedicines);
router.put("/:id", role(["admin"]), ctrl.updateMedicine);
router.delete("/:id", role(["admin"]), ctrl.deleteMedicine);

module.exports = router;

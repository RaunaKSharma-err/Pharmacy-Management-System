const router = require("express").Router();
const { register, login, me } = require("../controllers/authController");
const protect = require("../middlewares/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, me);

module.exports = router;

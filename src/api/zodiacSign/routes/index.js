const express = require("express");

const router = express.Router();

const adminZodiacSignRoutes = require("./adminZoadiacSign.routes");
const userZodiacSignRoutes = require("./userZoadiacSign.routes");

router.use("/admin", adminZodiacSignRoutes);
router.use("/user", userZodiacSignRoutes);

module.exports = router;

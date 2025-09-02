const express = require("express");

const router = express.Router();

const adminDrinkingRoutes = require("./adminDrinking.routes");
const userDrinkingRoutes = require("./userDrinking.routes");

router.use("/admin", adminDrinkingRoutes);
router.use("/user", userDrinkingRoutes);

module.exports = router;

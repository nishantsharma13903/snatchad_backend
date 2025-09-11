const express = require("express");

const router = express.Router();

const adminInterestRoutes = require("./adminAlcohol.routes");
const userInterestRoutes = require("./userAlcohol.routes");

router.use("/admin", adminInterestRoutes);
router.use("/user", userInterestRoutes);

module.exports = router;

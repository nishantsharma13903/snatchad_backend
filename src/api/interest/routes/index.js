const express = require("express");

const router = express.Router();

const adminInterestRoutes = require("./adminInterest.routes");
const userInterestRoutes = require("./userInterest.routes");

router.use("/admin", adminInterestRoutes);
router.use("/user", userInterestRoutes);

module.exports = router;

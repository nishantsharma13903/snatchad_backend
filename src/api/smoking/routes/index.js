const express = require("express");

const router = express.Router();

const adminSmokingRoutes = require("./adminSmoking.routes");
const userSmokingRoutes = require("./userSmoking.routes");

router.use("/admin", adminSmokingRoutes);
router.use("/user", userSmokingRoutes);

module.exports = router;

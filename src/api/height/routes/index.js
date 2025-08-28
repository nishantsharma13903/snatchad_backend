const express = require("express");

const router = express.Router();

const adminHeightRoutes = require("./adminHeight.routes");
const userHeightRoutes = require("./userHeight.routes");

router.use("/admin", adminHeightRoutes);
router.use("/user", userHeightRoutes);

module.exports = router;

const express = require("express");

const router = express.Router();

const adminTHCRoutes = require("./adminTHC.routes");
const userTHCRoutes = require("./userTHC.routes");

router.use("/admin", adminTHCRoutes);
router.use("/user", userTHCRoutes);

module.exports = router;

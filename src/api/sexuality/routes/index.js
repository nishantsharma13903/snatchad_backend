const express = require("express");

const router = express.Router();

const adminSexualityRoutes = require("./adminSexuality.routes");
const userSexualityRoutes = require("./userSexuality.routes");

router.use("/admin", adminSexualityRoutes);
router.use("/user", userSexualityRoutes);

module.exports = router;

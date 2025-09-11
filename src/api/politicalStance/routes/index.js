const express = require("express");

const router = express.Router();

const adminPoliticalStanceRoutes = require("./adminPoliticalStance.routes");
const userPoliticalStanceRoutes = require("./userPoliticalStance.routes");

router.use("/admin", adminPoliticalStanceRoutes);
router.use("/user", userPoliticalStanceRoutes);

module.exports = router;

const express = require("express");

const router = express.Router();

const adminReligionRoutes = require("./adminReligion.routes");
const userReligionRoutes = require("./userReligion.routes");

router.use("/admin", adminReligionRoutes);
router.use("/user", userReligionRoutes);

module.exports = router;

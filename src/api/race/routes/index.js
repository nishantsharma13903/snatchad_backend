const express = require("express");

const router = express.Router();

const adminRaceRoutes = require("./adminRace.routes");
const userRaceRoutes = require("./userRace.routes");

router.use("/admin", adminRaceRoutes);
router.use("/user", userRaceRoutes);

module.exports = router;

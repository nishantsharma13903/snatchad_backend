const express = require("express");

const router = express.Router();

const adminKidsRoutes = require("./adminKids.routes");
const userKidsRoutes = require("./userKids.routes");

router.use("/admin", adminKidsRoutes);
router.use("/user", userKidsRoutes);

module.exports = router;

const express = require("express");

const router = express.Router();

const adminEnneagramRoutes = require("./adminEnneagram.routes");
const userEnneagramRoutes = require("./userEnneagram.routes");

router.use("/admin", adminEnneagramRoutes);
router.use("/user", userEnneagramRoutes);

module.exports = router;

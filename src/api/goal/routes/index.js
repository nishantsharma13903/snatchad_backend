const express = require("express");

const router = express.Router();

const adminGoalRoutes = require("./adminGoal.routes");
const userGoalRoutes = require("./userGoal.routes");

router.use("/admin", adminGoalRoutes);
router.use("/user", userGoalRoutes);

module.exports = router;

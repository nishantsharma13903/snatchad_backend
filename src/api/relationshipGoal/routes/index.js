const express = require("express");

const router = express.Router();

const adminRelationshipGoalRoutes = require("./adminRelationshipGoal.routes");
const userRelationshipGoalRoutes = require("./userRelationshipGoal.routes");

router.use("/admin", adminRelationshipGoalRoutes);
router.use("/user", userRelationshipGoalRoutes);

module.exports = router;

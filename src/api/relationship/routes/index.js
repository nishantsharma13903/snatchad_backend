const express = require("express");

const router = express.Router();

const adminRelationshipRoutes = require("./adminRelationship.routes");
const userRelationshipRoutes = require("./userRelationship.routes");

router.use("/admin", adminRelationshipRoutes);
router.use("/user", userRelationshipRoutes);

module.exports = router;

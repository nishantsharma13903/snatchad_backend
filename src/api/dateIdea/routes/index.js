const express = require("express");

const router = express.Router();

const adminDateIdeaRoutes = require("./adminDateIdea.routes");
const userDateIdeaRoutes = require("./userDateIdea.routes");

router.use("/admin", adminDateIdeaRoutes);
router.use("/user", userDateIdeaRoutes);

module.exports = router;

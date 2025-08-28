const express = require("express");

const router = express.Router();

const adminHobbyRoutes = require("./adminHobby.routes");
const userHobbyRoutes = require("./userHobby.routes");

router.use("/admin", adminHobbyRoutes);
router.use("/user", userHobbyRoutes);

module.exports = router;

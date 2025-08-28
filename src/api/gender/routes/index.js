const express = require("express");

const router = express.Router();

const adminGenderRoutes = require("./adminGender.routes");
const userGenderRoutes = require("./userGender.routes");

router.use("/admin", adminGenderRoutes);
router.use("/user", userGenderRoutes);

module.exports = router;

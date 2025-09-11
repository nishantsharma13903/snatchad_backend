const express = require("express");

const router = express.Router();

const adminDrugRoutes = require("./adminDrug.routes");
const userDrugRoutes = require("./userDrug.routes");

router.use("/admin", adminDrugRoutes);
router.use("/user", userDrugRoutes);

module.exports = router;

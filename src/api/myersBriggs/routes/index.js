const express = require("express");

const router = express.Router();

const adminMyersBriggsRoutes = require("./adminMyersBriggs.routes");
const userMyersBriggsRoutes = require("./userMyersBriggs.routes");

router.use("/admin", adminMyersBriggsRoutes);
router.use("/user", userMyersBriggsRoutes);

module.exports = router;

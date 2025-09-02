const express = require("express");

const router = express.Router();

const adminLanguagesRoutes = require("./adminLanguages.routes");
const userLanguagesRoutes = require("./userLanguages.routes");

router.use("/admin", adminLanguagesRoutes);
router.use("/user", userLanguagesRoutes);

module.exports = router;

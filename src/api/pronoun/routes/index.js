const express = require("express");

const router = express.Router();

const adminPronounRoutes = require("./adminPronoun.routes");
const userPronounRoutes = require("./userPronoun.routes");

router.use("/admin", adminPronounRoutes);
router.use("/user", userPronounRoutes);

module.exports = router;

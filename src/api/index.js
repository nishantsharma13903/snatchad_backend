const express = require("express");

const router = express.Router();

const userModeRoutes = require("./quizModeUser/routes");

router.use("/user", userModeRoutes);

module.exports = router;

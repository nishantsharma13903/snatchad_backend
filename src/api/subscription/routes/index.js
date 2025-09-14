const express = require("express");

const router = express.Router();

const subscriptionRoutes = require("../routes/subscription.routes");

router.use("/plan", subscriptionRoutes);

module.exports = router;

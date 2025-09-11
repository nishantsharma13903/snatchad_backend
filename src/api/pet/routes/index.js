const express = require("express");

const router = express.Router();

const adminPetRoutes = require("./adminPet.routes");
const userPetRoutes = require("./userPet.routes");

router.use("/admin", adminPetRoutes);
router.use("/user", userPetRoutes);

module.exports = router;

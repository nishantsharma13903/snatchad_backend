const express = require("express");

const router = express.Router();

const userRoutes = require("./user/routes");
const adminRoutes = require("./admin/routes");
const genderRoutes = require("./gender/routes");
const sexualityRoutes = require("./sexuality/routes");
const interestRoutes = require("./interest/routes");
const heightRoutes = require("./height/routes");
const goalRoutes = require("./goal/routes");
const hobbyRoutes = require("./hobby/routes");
const relationshipRoutes = require("./relationship/routes");
const quizRoutes = require("./quiz/routes");

router.use("/user", userRoutes);
router.use("/admin", adminRoutes);
router.use("/gender", genderRoutes);
router.use("/sexuality", sexualityRoutes);
router.use("/interest", interestRoutes);
router.use("/relationship", relationshipRoutes);
router.use("/height", heightRoutes);
router.use("/hobby", hobbyRoutes);
router.use("/goal", goalRoutes);
router.use("/quiz", quizRoutes);

module.exports = router;
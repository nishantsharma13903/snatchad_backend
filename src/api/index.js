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
const relationshipGoalRoutes = require("./relationshipGoal/routes");
const drinkingRoutes = require("./drinking/routes");
const kidsRoutes = require("./kids/routes");
const languagesRoutes = require("./languages/routes");
const religionRoutes = require("./religion/routes");
const smokingRoutes = require("./smoking/routes");
const thcRoutes = require("./thc/routes");
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
router.use("/drinking", drinkingRoutes);
router.use("/kids", kidsRoutes);
router.use("/languages", languagesRoutes);
router.use("/relationshipGoal", relationshipGoalRoutes);
router.use("/religion", religionRoutes);
router.use("/smoking", smokingRoutes);
router.use("/thc", thcRoutes);
router.use("/quiz", quizRoutes);

module.exports = router;
const express = require('express');
const {upload} = require('@middlewares/multer.middleware')
const {verifyToken} = require('@/middlewares/jwt.middleware')
const adminGoalController = require('../controller/adminGoal.controller')
const GoalController = require('../controller/goal.controller')
const router = express.Router();


// Validation Schemas
const { validateBody } = require("@/middlewares/validate.middleware");

// JWT Audience
const { jwtAudience } = require('@config/jwt/jwt.config');
const { createGoalSchema, updateGoalSchema } = require('@/api/goal/validator/adminGoal.validator');

// Routes
router.post('/create', verifyToken(jwtAudience.admin), upload.none(),validateBody(createGoalSchema), adminGoalController.createNewGoal);
router.post('/update/:goalId',verifyToken(jwtAudience.admin), upload.none(), validateBody(updateGoalSchema), adminGoalController.updateGoal);
router.get('/get/:goalId',verifyToken(jwtAudience.admin), upload.none(), adminGoalController.getGoalById);
router.get('/get-all',verifyToken(jwtAudience.admin), upload.none(), GoalController.getAllGoal);


module.exports = router;
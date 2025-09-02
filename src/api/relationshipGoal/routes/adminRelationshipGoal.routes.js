const express = require('express');
const {upload} = require('@middlewares/multer.middleware')
const {verifyToken} = require('@/middlewares/jwt.middleware')
const adminRelationshipGoalController = require('../controller/adminRelationshipGoal.controller')
const RelationshipGoalController = require('../controller/relationshipGoal.controller')
const router = express.Router();


// Validation Schemas
const { validateBody } = require("@/middlewares/validate.middleware");

// JWT Audience
const { jwtAudience } = require('@config/jwt/jwt.config');
const { createRelationshipGoalSchema, updateRelationshipGoalSchema } = require('@/api/relationshipGoal/validator/adminRelationshipGoal.validator');

// Routes
router.post('/create', verifyToken(jwtAudience.admin), upload.none(),validateBody(createRelationshipGoalSchema), adminRelationshipGoalController.createNewRelationshipGoal);
router.post('/update/:relationshipGoalId',verifyToken(jwtAudience.admin), upload.none(), validateBody(updateRelationshipGoalSchema), adminRelationshipGoalController.updateRelationshipGoal);
router.get('/get/:relationshipGoalId',verifyToken(jwtAudience.admin), upload.none(), adminRelationshipGoalController.getRelationshipGoalById);
router.get('/get-all',verifyToken(jwtAudience.admin), upload.none(), RelationshipGoalController.getAllRelationshipGoal);


module.exports = router;
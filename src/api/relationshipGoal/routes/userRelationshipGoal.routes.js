const express = require('express');
const {upload} = require('@middlewares/multer.middleware')
const {verifyToken} = require('@middlewares/jwt.middleware')
const userRelationshipGoalController = require('../controller/userRelationshipGoal.controller')
const relationshipGoalController = require('../controller/relationshipGoal.controller')
const router = express.Router();


// JWT Audience
const { jwtAudience } = require('@config/jwt/jwt.config');

// Routes
router.get('/get-all',verifyToken(jwtAudience.user), upload.none(), relationshipGoalController.getAllRelationshipGoal);


module.exports = router;
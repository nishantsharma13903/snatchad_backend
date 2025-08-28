const express = require('express');
const {upload} = require('@middlewares/multer.middleware')
const {verifyToken} = require('@/middlewares/jwt.middleware')
const adminRelationshipController = require('../controller/adminRelationship.controller')
const relationshipController = require('../controller/relationship.controller')
const router = express.Router();


// Validation Schemas
const { validateBody } = require("@/middlewares/validate.middleware");

// JWT Audience
const { jwtAudience } = require('@config/jwt/jwt.config');
const { createRelationshipSchema, updateRelationshipSchema } = require('@/api/relationship/validator/adminRelationship.validator');

// Routes
router.post('/create', verifyToken(jwtAudience.admin), upload.none(),validateBody(createRelationshipSchema), adminRelationshipController.createNewRelationship);
router.post('/update/:relationshipId',verifyToken(jwtAudience.admin), upload.none(), validateBody(updateRelationshipSchema), adminRelationshipController.updateRelationship);
router.get('/get/:relationshipId',verifyToken(jwtAudience.admin), upload.none(), adminRelationshipController.getRelationshipById);
router.get('/get-all',verifyToken(jwtAudience.admin), upload.none(), relationshipController.getAllRelationship);

module.exports = router;
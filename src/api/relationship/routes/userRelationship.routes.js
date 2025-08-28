const express = require('express');
const {upload} = require('@middlewares/multer.middleware')
const {verifyToken} = require('@middlewares/jwt.middleware')
const userRelationshipController = require('../controller/userRelationship.controller')
const relationshipController = require('../controller/relationship.controller')
const router = express.Router();


// JWT Audience
const { jwtAudience } = require('@config/jwt/jwt.config');

// Routes
router.get('/get-all',verifyToken(jwtAudience.user), upload.none(), relationshipController.getAllRelationship);


module.exports = router;
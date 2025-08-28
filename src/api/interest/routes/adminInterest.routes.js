const express = require('express');
const {upload} = require('@middlewares/multer.middleware')
const {verifyToken} = require('@/middlewares/jwt.middleware')
const adminInterestController = require('../controller/adminInterest.controller')
const InterestController = require('../controller/interest.controller')
const router = express.Router();


// Validation Schemas
const { validateBody } = require("@/middlewares/validate.middleware");

// JWT Audience
const { jwtAudience } = require('@config/jwt/jwt.config');
const { createInterestSchema, updateInterestSchema } = require('@/api/interest/validator/adminInterest.validator');

// Routes
router.post('/create', verifyToken(jwtAudience.admin), upload.none(),validateBody(createInterestSchema), adminInterestController.createNewInterest);
router.post('/update/:interestId',verifyToken(jwtAudience.admin), upload.none(), validateBody(updateInterestSchema), adminInterestController.updateInterest);
router.get('/get/:interestId',verifyToken(jwtAudience.admin), upload.none(), adminInterestController.getInterestById);
router.get('/get-all',verifyToken(jwtAudience.admin), upload.none(), InterestController.getAllInterest);


module.exports = router;
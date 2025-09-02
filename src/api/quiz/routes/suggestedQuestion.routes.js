const express = require('express');
const {upload} = require('@/middlewares/multer.middleware')
const {verifyToken} = require('@/middlewares/jwt.middleware')
const suggestedQueController = require('../controller/suggestedQuestion.controller')
const router = express.Router();


// Validation Schemas
const { validateBody } = require("@/middlewares/validate.middleware");

// JWT Audience
const { jwtAudience } = require('@/config/jwt/jwt.config');
const { createSuggestedQueSchema, updateSuggestedQueSchema } = require('@/api/quiz/validator/suggestedQuestion.validator');

// Routes
router.post('/create', verifyToken(jwtAudience.admin), upload.none(),validateBody(createSuggestedQueSchema), suggestedQueController.createNewSuggestedQue);
router.post('/update/:questionId',verifyToken(jwtAudience.admin), upload.none(), validateBody(updateSuggestedQueSchema), suggestedQueController.updateSuggestedQue);
router.get('/get/:questionId',verifyToken(jwtAudience.admin), upload.none(), suggestedQueController.getSuggestedQueById);
router.get('/get-all',verifyToken(jwtAudience.user), upload.none(), suggestedQueController.getAllSuggestedQue);


module.exports = router;
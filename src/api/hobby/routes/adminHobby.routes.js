const express = require('express');
const {upload} = require('@/middlewares/multer.middleware')
const {verifyToken} = require('@/middlewares/jwt.middleware')
const adminHobbyController = require('../controller/adminHobby.controller')
const HobbyController = require('../controller/hobby.controller')
const router = express.Router();


// Validation Schemas
const { validateBody } = require("@/middlewares/validate.middleware");

// JWT Audience
const { jwtAudience } = require('@config/jwt/jwt.config');
const { createHobbySchema, updateHobbySchema } = require('@/api/hobby/validator/adminHobby.validator');

// Routes
router.post('/create', verifyToken(jwtAudience.admin), upload.single("icon"),validateBody(createHobbySchema), adminHobbyController.createNewHobby);
router.post('/update/:hobbyId',verifyToken(jwtAudience.admin), upload.single("icon"), validateBody(updateHobbySchema), adminHobbyController.updateHobby);
router.get('/get/:hobbyId',verifyToken(jwtAudience.admin), upload.none(), adminHobbyController.getHobbyById);
router.get('/get-all',verifyToken(jwtAudience.admin), upload.none(), HobbyController.getAllHobby);


module.exports = router;
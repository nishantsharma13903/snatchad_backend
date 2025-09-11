const express = require('express');
const {upload} = require('@middlewares/multer.middleware')
const {verifyToken} = require('@/middlewares/jwt.middleware')
const adminAlcoholController = require('../controller/adminAlcohol.controller')
const AlcoholController = require('../controller/alcohol.controller')
const router = express.Router();


// Validation Schemas
const { validateBody } = require("@/middlewares/validate.middleware");

// JWT Audience
const { jwtAudience } = require('@config/jwt/jwt.config');
const { createAlcoholSchema, updateAlcoholSchema } = require('@/api/alcohol/validator/adminAlcohol.validator');

// Routes
router.post('/create', verifyToken(jwtAudience.admin), upload.none(),validateBody(createAlcoholSchema), adminAlcoholController.createNewAlcohol);
router.post('/update/:alcoholId',verifyToken(jwtAudience.admin), upload.none(), validateBody(updateAlcoholSchema), adminAlcoholController.updateAlcohol);
router.get('/get/:alcoholId',verifyToken(jwtAudience.admin), upload.none(), adminAlcoholController.getAlcoholById);
router.get('/get-all',verifyToken(jwtAudience.admin), upload.none(), AlcoholController.getAllAlcohol);


module.exports = router;
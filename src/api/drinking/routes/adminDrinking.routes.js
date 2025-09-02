const express = require('express');
const {upload} = require('@middlewares/multer.middleware')
const {verifyToken} = require('@/middlewares/jwt.middleware')
const adminDrinkingController = require('../controller/adminDrinking.controller')
const DrinkingController = require('../controller/drinking.controller')
const router = express.Router();


// Validation Schemas
const { validateBody } = require("@/middlewares/validate.middleware");

// JWT Audience
const { jwtAudience } = require('@config/jwt/jwt.config');
const { createDrinkingSchema, updateDrinkingSchema } = require('@/api/drinking/validator/adminDrinking.validator');

// Routes
router.post('/create', verifyToken(jwtAudience.admin), upload.none(),validateBody(createDrinkingSchema), adminDrinkingController.createNewDrinking);
router.post('/update/:drinkingId',verifyToken(jwtAudience.admin), upload.none(), validateBody(updateDrinkingSchema), adminDrinkingController.updateDrinking);
router.get('/get/:drinkingId',verifyToken(jwtAudience.admin), upload.none(), adminDrinkingController.getDrinkingById);
router.get('/get-all',verifyToken(jwtAudience.admin), upload.none(), DrinkingController.getAllDrinking);


module.exports = router;
const express = require('express');
const {upload} = require('@middlewares/multer.middleware')
const {verifyToken} = require('@/middlewares/jwt.middleware')
const adminGenderController = require('../controller/adminGender.controller')
const genderController = require('../controller/gender.controller')
const router = express.Router();


// Validation Schemas
const { validateBody } = require("@/middlewares/validate.middleware");

// JWT Audience
const { jwtAudience } = require('@config/jwt/jwt.config');
const { createGenderSchema, updateGenderSchema } = require('@/api/gender/validator/adminGender.validator');

// Routes
router.post('/create', verifyToken(jwtAudience.admin), upload.none(),validateBody(createGenderSchema), adminGenderController.createNewGender);
router.post('/update/:genderId',verifyToken(jwtAudience.admin), upload.none(), validateBody(updateGenderSchema), adminGenderController.updateGender);
router.get('/get/:genderId',verifyToken(jwtAudience.admin), upload.none(), adminGenderController.getGenderById);
router.get('/get-all',verifyToken(jwtAudience.admin), upload.none(), genderController.getAllGenders);


module.exports = router;
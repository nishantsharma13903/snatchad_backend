const express = require('express');
const {upload} = require('@middlewares/multer.middleware')
const {verifyToken} = require('@/middlewares/jwt.middleware')
const adminLanguagesController = require('../controller/adminLanguages.controller')
const LanguagesController = require('../controller/languages.controller')
const router = express.Router();


// Validation Schemas
const { validateBody } = require("@/middlewares/validate.middleware");

// JWT Audience
const { jwtAudience } = require('@config/jwt/jwt.config');
const { createLanguagesSchema, updateLanguagesSchema } = require('@/api/languages/validator/adminLanguages.validator');

// Routes
router.post('/create', verifyToken(jwtAudience.admin), upload.none(),validateBody(createLanguagesSchema), adminLanguagesController.createNewLanguages);
router.post('/update/:languagesId',verifyToken(jwtAudience.admin), upload.none(), validateBody(updateLanguagesSchema), adminLanguagesController.updateLanguages);
router.get('/get/:languagesId',verifyToken(jwtAudience.admin), upload.none(), adminLanguagesController.getLanguagesById);
router.get('/get-all',verifyToken(jwtAudience.admin), upload.none(), LanguagesController.getAllLanguages);


module.exports = router;
const express = require('express');
const {upload} = require('@middlewares/multer.middleware')
const {verifyToken} = require('@/middlewares/jwt.middleware')
const adminSexualityController = require('../controller/adminSexuality.controller')
const SexualityController = require('../controller/sexuality.controller')
const router = express.Router();


// Validation Schemas
const { validateBody } = require("@/middlewares/validate.middleware");

// JWT Audience
const { jwtAudience } = require('@config/jwt/jwt.config');
const { createSexualitySchema, updateSexualitySchema } = require('@/api/sexuality/validator/adminSexuality.validator');

// Routes
router.post('/create', verifyToken(jwtAudience.admin), upload.none(),validateBody(createSexualitySchema), adminSexualityController.createNewSexuality);
router.post('/update/:sexualityId',verifyToken(jwtAudience.admin), upload.none(), validateBody(updateSexualitySchema), adminSexualityController.updateSexuality);
router.get('/get/:sexualityId',verifyToken(jwtAudience.admin), upload.none(), adminSexualityController.getSexualityById);
router.get('/get-all',verifyToken(jwtAudience.admin), upload.none(), SexualityController.getAllSexuality);


module.exports = router;
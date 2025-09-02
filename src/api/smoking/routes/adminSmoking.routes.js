const express = require('express');
const {upload} = require('@middlewares/multer.middleware')
const {verifyToken} = require('@/middlewares/jwt.middleware')
const adminSmokingController = require('../controller/adminSmoking.controller')
const SmokingController = require('../controller/smoking.controller')
const router = express.Router();


// Validation Schemas
const { validateBody } = require("@/middlewares/validate.middleware");

// JWT Audience
const { jwtAudience } = require('@config/jwt/jwt.config');
const { createSmokingSchema, updateSmokingSchema } = require('@/api/smoking/validator/adminSmoking.validator');

// Routes
router.post('/create', verifyToken(jwtAudience.admin), upload.none(),validateBody(createSmokingSchema), adminSmokingController.createNewSmoking);
router.post('/update/:smokingId',verifyToken(jwtAudience.admin), upload.none(), validateBody(updateSmokingSchema), adminSmokingController.updateSmoking);
router.get('/get/:smokingId',verifyToken(jwtAudience.admin), upload.none(), adminSmokingController.getSmokingById);
router.get('/get-all',verifyToken(jwtAudience.admin), upload.none(), SmokingController.getAllSmoking);


module.exports = router;
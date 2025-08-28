const express = require('express');
const {upload} = require('@middlewares/multer.middleware')
const {verifyToken} = require('@/middlewares/jwt.middleware')
const adminHeightController = require('../controller/adminHeight.controller')
const HeightController = require('../controller/height.controller')
const router = express.Router();


// Validation Schemas
const { validateBody } = require("@/middlewares/validate.middleware");

// JWT Audience
const { jwtAudience } = require('@config/jwt/jwt.config');
const { createHeightSchema, updateHeightSchema } = require('@/api/height/validator/adminHeight.validator');

// Routes
router.post('/create', verifyToken(jwtAudience.admin), upload.none(),validateBody(createHeightSchema), adminHeightController.createNewHeight);
router.post('/update/:heightId',verifyToken(jwtAudience.admin), upload.none(), validateBody(updateHeightSchema), adminHeightController.updateHeight);
router.get('/get/:heightId',verifyToken(jwtAudience.admin), upload.none(), adminHeightController.getHeightById);
router.get('/get-all',verifyToken(jwtAudience.admin), upload.none(), HeightController.getAllHeight);


module.exports = router;
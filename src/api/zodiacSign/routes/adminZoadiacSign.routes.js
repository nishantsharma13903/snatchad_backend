const express = require('express');
const {upload} = require('@/middlewares/multer.middleware')
const {verifyToken} = require('@/middlewares/jwt.middleware')
const adminZodiacSignController = require('../controller/adminZoadiacSign.controller')
const ZodiacSignController = require('../controller/zoadiacSign.controller')
const router = express.Router();


// Validation Schemas
const { validateBody } = require("@/middlewares/validate.middleware");

// JWT Audience
const { jwtAudience } = require('@/config/jwt/jwt.config');
const { createZodiacSignSchema, updateZodiacSignSchema } = require('@/api/zodiacSign/validator/adminZoadiacSign.validator');

// Routes
router.post('/create', verifyToken(jwtAudience.admin), upload.none(),validateBody(createZodiacSignSchema), adminZodiacSignController.createNewZodiacSign);
router.post('/update/:zodiacSignId',verifyToken(jwtAudience.admin), upload.none(), validateBody(updateZodiacSignSchema), adminZodiacSignController.updateZodiacSign);
router.get('/get/:zodiacSignId',verifyToken(jwtAudience.admin), upload.none(), adminZodiacSignController.getZodiacSignById);
router.get('/get-all',verifyToken(jwtAudience.admin), upload.none(), ZodiacSignController.getAllZodiacSign);


module.exports = router;
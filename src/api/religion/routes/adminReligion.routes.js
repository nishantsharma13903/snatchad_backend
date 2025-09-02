const express = require('express');
const {upload} = require('@middlewares/multer.middleware')
const {verifyToken} = require('@/middlewares/jwt.middleware')
const adminReligionController = require('../controller/adminReligion.controller')
const ReligionController = require('../controller/religion.controller')
const router = express.Router();


// Validation Schemas
const { validateBody } = require("@/middlewares/validate.middleware");

// JWT Audience
const { jwtAudience } = require('@config/jwt/jwt.config');
const { createReligionSchema, updateReligionSchema } = require('@/api/religion/validator/adminReligion.validator');

// Routes
router.post('/create', verifyToken(jwtAudience.admin), upload.none(),validateBody(createReligionSchema), adminReligionController.createNewReligion);
router.post('/update/:religionId',verifyToken(jwtAudience.admin), upload.none(), validateBody(updateReligionSchema), adminReligionController.updateReligion);
router.get('/get/:religionId',verifyToken(jwtAudience.admin), upload.none(), adminReligionController.getReligionById);
router.get('/get-all',verifyToken(jwtAudience.admin), upload.none(), ReligionController.getAllReligion);


module.exports = router;
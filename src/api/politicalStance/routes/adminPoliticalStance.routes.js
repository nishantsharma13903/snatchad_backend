const express = require('express');
const {upload} = require('@middlewares/multer.middleware')
const {verifyToken} = require('@/middlewares/jwt.middleware')
const adminPoliticalStanceController = require('../controller/adminPoliticalStance.controller')
const PoliticalStanceController = require('../controller/politicalStance.controller')
const router = express.Router();


// Validation Schemas
const { validateBody } = require("@/middlewares/validate.middleware");

// JWT Audience
const { jwtAudience } = require('@config/jwt/jwt.config');
const { createPoliticalStanceSchema, updatePoliticalStanceSchema } = require('@/api/politicalStance/validator/adminPoliticalStance.validator');

// Routes
router.post('/create', verifyToken(jwtAudience.admin), upload.none(),validateBody(createPoliticalStanceSchema), adminPoliticalStanceController.createNewPoliticalStance);
router.post('/update/:politicalStanceId',verifyToken(jwtAudience.admin), upload.none(), validateBody(updatePoliticalStanceSchema), adminPoliticalStanceController.updatePoliticalStance);
router.get('/get/:politicalStanceId',verifyToken(jwtAudience.admin), upload.none(), adminPoliticalStanceController.getPoliticalStanceById);
router.get('/get-all',verifyToken(jwtAudience.admin), upload.none(), PoliticalStanceController.getAllPoliticalStance);


module.exports = router;
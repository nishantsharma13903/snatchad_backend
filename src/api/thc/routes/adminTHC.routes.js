const express = require('express');
const {upload} = require('@middlewares/multer.middleware')
const {verifyToken} = require('@/middlewares/jwt.middleware')
const adminTHCController = require('../controller/adminTHC.controller')
const THCController = require('../controller/thc.controller')
const router = express.Router();


// Validation Schemas
const { validateBody } = require("@/middlewares/validate.middleware");

// JWT Audience
const { jwtAudience } = require('@config/jwt/jwt.config');
const { createTHCSchema, updateTHCSchema } = require('@/api/thc/validator/adminTHC.validator');

// Routes
router.post('/create', verifyToken(jwtAudience.admin), upload.none(),validateBody(createTHCSchema), adminTHCController.createNewTHC);
router.post('/update/:thcId',verifyToken(jwtAudience.admin), upload.none(), validateBody(updateTHCSchema), adminTHCController.updateTHC);
router.get('/get/:thcId',verifyToken(jwtAudience.admin), upload.none(), adminTHCController.getTHCById);
router.get('/get-all',verifyToken(jwtAudience.admin), upload.none(), THCController.getAllTHC);


module.exports = router;
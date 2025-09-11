const express = require('express');
const {upload} = require('@middlewares/multer.middleware')
const {verifyToken} = require('@/middlewares/jwt.middleware')
const adminDrugController = require('../controller/adminDrug.controller')
const DrugController = require('../controller/drug.controller')
const router = express.Router();


// Validation Schemas
const { validateBody } = require("@/middlewares/validate.middleware");

// JWT Audience
const { jwtAudience } = require('@config/jwt/jwt.config');
const { createDrugSchema, updateDrugSchema } = require('@/api/drug/validator/adminDrug.validator');

// Routes
router.post('/create', verifyToken(jwtAudience.admin), upload.none(),validateBody(createDrugSchema), adminDrugController.createNewDrug);
router.post('/update/:drugId',verifyToken(jwtAudience.admin), upload.none(), validateBody(updateDrugSchema), adminDrugController.updateDrug);
router.get('/get/:drugId',verifyToken(jwtAudience.admin), upload.none(), adminDrugController.getDrugById);
router.get('/get-all',verifyToken(jwtAudience.admin), upload.none(), DrugController.getAllDrug);


module.exports = router;
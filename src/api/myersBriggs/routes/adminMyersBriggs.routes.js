const express = require('express');
const {upload} = require('@middlewares/multer.middleware')
const {verifyToken} = require('@/middlewares/jwt.middleware')
const adminMyersBriggsController = require('../controller/adminMyersBriggs.controller')
const MyersBriggsController = require('../controller/myersBriggs.controller')
const router = express.Router();


// Validation Schemas
const { validateBody } = require("@/middlewares/validate.middleware");

// JWT Audience
const { jwtAudience } = require('@config/jwt/jwt.config');
const { createMyersBriggsSchema, updateMyersBriggsSchema } = require('@/api/myersBriggs/validator/adminMyersBriggs.validator');

// Routes
router.post('/create', verifyToken(jwtAudience.admin), upload.none(),validateBody(createMyersBriggsSchema), adminMyersBriggsController.createNewMyersBriggs);
router.post('/update/:myersBriggsId',verifyToken(jwtAudience.admin), upload.none(), validateBody(updateMyersBriggsSchema), adminMyersBriggsController.updateMyersBriggs);
router.get('/get/:myersBriggsId',verifyToken(jwtAudience.admin), upload.none(), adminMyersBriggsController.getMyersBriggsById);
router.get('/get-all',verifyToken(jwtAudience.admin), upload.none(), MyersBriggsController.getAllMyersBriggs);


module.exports = router;
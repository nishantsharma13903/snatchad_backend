const express = require('express');
const {upload} = require('@middlewares/multer.middleware')
const {verifyToken} = require('@/middlewares/jwt.middleware')
const adminKidsController = require('../controller/adminKids.controller')
const KidsController = require('../controller/kids.controller')
const router = express.Router();


// Validation Schemas
const { validateBody } = require("@/middlewares/validate.middleware");

// JWT Audience
const { jwtAudience } = require('@config/jwt/jwt.config');
const { createKidsSchema, updateKidsSchema } = require('@/api/kids/validator/adminKids.validator');

// Routes
router.post('/create', verifyToken(jwtAudience.admin), upload.none(),validateBody(createKidsSchema), adminKidsController.createNewKids);
router.post('/update/:kidsId',verifyToken(jwtAudience.admin), upload.none(), validateBody(updateKidsSchema), adminKidsController.updateKids);
router.get('/get/:kidsId',verifyToken(jwtAudience.admin), upload.none(), adminKidsController.getKidsById);
router.get('/get-all',verifyToken(jwtAudience.admin), upload.none(), KidsController.getAllKids);


module.exports = router;
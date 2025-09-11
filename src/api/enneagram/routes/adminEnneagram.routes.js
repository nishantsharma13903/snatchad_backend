const express = require('express');
const {upload} = require('@middlewares/multer.middleware')
const {verifyToken} = require('@/middlewares/jwt.middleware')
const adminEnneagramController = require('../controller/adminEnneagram.controller')
const EnneagramController = require('../controller/enneagram.controller')
const router = express.Router();


// Validation Schemas
const { validateBody } = require("@/middlewares/validate.middleware");

// JWT Audience
const { jwtAudience } = require('@config/jwt/jwt.config');
const { createEnneagramSchema, updateEnneagramSchema } = require('@/api/enneagram/validator/adminEnneagram.validator');

// Routes
router.post('/create', verifyToken(jwtAudience.admin), upload.none(),validateBody(createEnneagramSchema), adminEnneagramController.createNewEnneagram);
router.post('/update/:enneagramId',verifyToken(jwtAudience.admin), upload.none(), validateBody(updateEnneagramSchema), adminEnneagramController.updateEnneagram);
router.get('/get/:enneagramId',verifyToken(jwtAudience.admin), upload.none(), adminEnneagramController.getEnneagramById);
router.get('/get-all',verifyToken(jwtAudience.admin), upload.none(), EnneagramController.getAllEnneagram);


module.exports = router;
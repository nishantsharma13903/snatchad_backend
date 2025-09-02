const express = require('express');
const {upload} = require('@middlewares/multer.middleware')
const {verifyToken} = require('@middlewares/jwt.middleware')
const userSmokingController = require('../controller/userSmoking.controller')
const smokingController = require('../controller/smoking.controller')
const router = express.Router();


// JWT Audience
const { jwtAudience } = require('@config/jwt/jwt.config');

// Routes
router.get('/get-all',verifyToken(jwtAudience.user), upload.none(), smokingController.getAllSmoking);


module.exports = router;
const express = require('express');
const {upload} = require('@middlewares/multer.middleware')
const {verifyToken} = require('@middlewares/jwt.middleware')
const userZodiacSignController = require('../controller/userZoadiacSign.controller')
const zodiacSignController = require('../controller/zoadiacSign.controller')
const router = express.Router();


// JWT Audience
const { jwtAudience } = require('@config/jwt/jwt.config');

// Routes
router.get('/get-all',verifyToken(jwtAudience.user), upload.none(), zodiacSignController.getAllZodiacSign);


module.exports = router;
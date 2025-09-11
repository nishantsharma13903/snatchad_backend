const express = require('express');
const {upload} = require('@middlewares/multer.middleware')
const {verifyToken} = require('@middlewares/jwt.middleware')
const userAlcoholController = require('../controller/userAlcohol.controller')
const alcoholController = require('../controller/alcohol.controller')
const router = express.Router();


// JWT Audience
const { jwtAudience } = require('@config/jwt/jwt.config');

// Routes
router.get('/get-all',verifyToken(jwtAudience.user), upload.none(), alcoholController.getAllAlcohol);


module.exports = router;
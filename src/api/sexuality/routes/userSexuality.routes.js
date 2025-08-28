const express = require('express');
const {upload} = require('@middlewares/multer.middleware')
const {verifyToken} = require('@middlewares/jwt.middleware')
const userSexualityController = require('../controller/userSexuality.controller')
const sexualityController = require('../controller/sexuality.controller')
const router = express.Router();


// JWT Audience
const { jwtAudience } = require('@config/jwt/jwt.config');

// Routes
router.get('/get-all',verifyToken(jwtAudience.user), upload.none(), sexualityController.getAllSexuality);


module.exports = router;
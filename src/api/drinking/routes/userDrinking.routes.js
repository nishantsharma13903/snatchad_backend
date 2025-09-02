const express = require('express');
const {upload} = require('@middlewares/multer.middleware')
const {verifyToken} = require('@middlewares/jwt.middleware')
const userDrinkingController = require('../controller/userDrinking.controller')
const drinkingController = require('../controller/drinking.controller')
const router = express.Router();


// JWT Audience
const { jwtAudience } = require('@config/jwt/jwt.config');

// Routes
router.get('/get-all',verifyToken(jwtAudience.user), upload.none(), drinkingController.getAllDrinking);


module.exports = router;
const express = require('express');
const {upload} = require('@middlewares/multer.middleware')
const {verifyToken} = require('@middlewares/jwt.middleware')
const userKidsController = require('../controller/userKids.controller')
const kidsController = require('../controller/kids.controller')
const router = express.Router();


// JWT Audience
const { jwtAudience } = require('@config/jwt/jwt.config');

// Routes
router.get('/get-all',verifyToken(jwtAudience.user), upload.none(), kidsController.getAllKids);


module.exports = router;
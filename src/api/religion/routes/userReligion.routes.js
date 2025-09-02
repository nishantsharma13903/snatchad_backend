const express = require('express');
const {upload} = require('@middlewares/multer.middleware')
const {verifyToken} = require('@middlewares/jwt.middleware')
const userReligionController = require('../controller/userReligion.controller')
const religionController = require('../controller/religion.controller')
const router = express.Router();


// JWT Audience
const { jwtAudience } = require('@config/jwt/jwt.config');

// Routes
router.get('/get-all',verifyToken(jwtAudience.user), upload.none(), religionController.getAllReligion);


module.exports = router;
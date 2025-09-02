const express = require('express');
const {upload} = require('@middlewares/multer.middleware')
const {verifyToken} = require('@middlewares/jwt.middleware')
const userTHCController = require('../controller/userTHC.controller')
const thcController = require('../controller/thc.controller')
const router = express.Router();


// JWT Audience
const { jwtAudience } = require('@config/jwt/jwt.config');

// Routes
router.get('/get-all',verifyToken(jwtAudience.user), upload.none(), thcController.getAllTHC);


module.exports = router;
const express = require('express');
const {upload} = require('@middlewares/multer.middleware')
const {verifyToken} = require('@middlewares/jwt.middleware')
const userMyersBriggsController = require('../controller/userMyersBriggs.controller')
const myersBriggsController = require('../controller/myersBriggs.controller')
const router = express.Router();


// JWT Audience
const { jwtAudience } = require('@config/jwt/jwt.config');

// Routes
router.get('/get-all',verifyToken(jwtAudience.user), upload.none(), myersBriggsController.getAllMyersBriggs);


module.exports = router;
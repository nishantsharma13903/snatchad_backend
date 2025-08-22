const express = require('express');
const {upload} = require('@middlewares/multer.middleware')
const {verifyToken} = require('@middlewares/jwt.middleware')
const authController = require('../controller/auth.controller')
const router = express.Router();


// Validation Schemas
const { validateBody } = require("@/middlewares/validate.middleware");
const { sendAuthOTPSchema, verificationOTPSchema, googleAuthSchema } = require("../validator/auth.validator");

// JWT Audience
const { jwtAudience } = require('@config/jwt/jwt.config');

// Routes
router.post('/send-auth-otp', upload.none(),validateBody(sendAuthOTPSchema), authController.sendAuthOTP);
router.post('/verify-auth-otp', upload.none(),validateBody(verificationOTPSchema), authController.verifyOTP);
router.post('/logout', verifyToken(jwtAudience.user), upload.none(), authController.logoutUser);
router.post('/refresh-auth-tokens',verifyToken(jwtAudience.user), upload.none(), authController.refreshAuthTokens);


module.exports = router;
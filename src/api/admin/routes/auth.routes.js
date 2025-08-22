const express = require('express');
const {upload} = require('@/middlewares/multer.middleware')
const {verifyToken} = require('@middlewares/jwt.middleware')
const authController = require('../controller/auth.controller')
const router = express.Router();


// Validation Schemas
const { validateBody } = require("@/middlewares/validate.middleware");
// JWT Audience
const { jwtAudience } = require('@config/jwt/jwt.config');
const { adminLoginSchema, adminUpdatePasswordSchema } = require('@/api/admin/validator/auth.validator');

// Routes
router.post('/login', upload.none(),validateBody(adminLoginSchema), authController.handleAdminLogin);
router.post('/logout', verifyToken(jwtAudience.admin),upload.none(),  authController.handleAdminLogout);

module.exports = router;
const express = require('express');
const {upload} = require('@middlewares/multer.middleware')
const profileController = require('../controller/profile.controller')
const router = express.Router();


// Validation Schemas
const { validateBody } = require("@/middlewares/validate.middleware");
// JWT Audience
const { jwtAudience } = require('@config/jwt/jwt.config');
const { adminUpdatePasswordSchema } = require('@/api/admin/validator/auth.validator');
const { verifyToken } = require('@/middlewares/jwt.middleware');

// Routes
router.post('/update-password',verifyToken(jwtAudience.admin), upload.none(),validateBody(adminUpdatePasswordSchema), profileController.handleUpdateAdminPassword);
router.get('/details',verifyToken(jwtAudience.admin), upload.none(), profileController.handleGetAdminProfile);

module.exports = router;
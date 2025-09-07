const express = require('express');
const {upload} = require('@/middlewares/multer.middleware')
const {verifyToken} = require('@middlewares/jwt.middleware')
const adminController = require('../controller/admin.controller')
const router = express.Router();

// Validation Schemas
const { jwtAudience } = require('@config/jwt/jwt.config');

router.get(
  "/get-users-by-status",
  verifyToken(jwtAudience.admin),
  upload.none(),
  adminController.getUserByStatus
);

router.get(
  "/get-users-by-mode",
  verifyToken(jwtAudience.admin),
  upload.none(),
  adminController.getUserByMode
);

module.exports = router;
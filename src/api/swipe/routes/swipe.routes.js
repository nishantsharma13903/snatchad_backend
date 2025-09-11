const express = require('express');
const router = express.Router()

const swipeController = require('../controller/swipe.controller');
const { verifyToken } = require('@/middlewares/jwt.middleware');
const { jwtAudience } = require('@/config/jwt/jwt.config');

router.post('/swipe', verifyToken(jwtAudience.user), swipeController.swipeAction)


module.exports = router;
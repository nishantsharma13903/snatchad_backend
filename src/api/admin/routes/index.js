const express = require('express');

const router = express.Router();

const adminRoutes = require('./auth.routes');
const profileRoutes = require('./profile.routes');

router.use('/auth', adminRoutes)
router.use('/profile', profileRoutes)

module.exports = router;
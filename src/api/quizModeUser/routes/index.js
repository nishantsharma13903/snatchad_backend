// Module inner routes handling

const express = require('express');
const router = express.Router();

// Inner Routes
const authRoutes = require('./auth.routes');
const profileRoutes = require('./profile.routes');

router.use('/auth', authRoutes);
router.use('/profile', profileRoutes)

module.exports = router;
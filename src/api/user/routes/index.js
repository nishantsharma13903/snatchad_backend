// Module inner routes handling

const express = require('express');
const router = express.Router();

// Inner Routes
const authRoutes = require('./auth.routes');
const profileRoutes = require('./profile.routes');
const adminRoutes = require('./admin.routes');

router.use('/auth', authRoutes);
router.use('/profile', profileRoutes)
router.use('/admin', adminRoutes)

module.exports = router;
const express = require('express');

const router = express.Router();

const suggestedQueRoutes = require('./suggestedQuestion.routes');
const userQuizRoutes = require('./userQuiz.routes');
const attemptQuizRoutes = require('./attemptQuiz.routes');

router.use('/suggested-question', suggestedQueRoutes);
router.use('/user', userQuizRoutes);
router.use('/attempt', attemptQuizRoutes);

module.exports = router;
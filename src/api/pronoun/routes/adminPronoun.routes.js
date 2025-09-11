const express = require('express');
const {upload} = require('@middlewares/multer.middleware')
const {verifyToken} = require('@/middlewares/jwt.middleware')
const adminPronounController = require('../controller/adminPronoun.controller')
const PronounController = require('../controller/pronoun.controller')
const router = express.Router();


// Validation Schemas
const { validateBody } = require("@/middlewares/validate.middleware");

// JWT Audience
const { jwtAudience } = require('@config/jwt/jwt.config');
const { createPronounSchema, updatePronounSchema } = require('@/api/pronoun/validator/adminPronoun.validator');

// Routes
router.post('/create', verifyToken(jwtAudience.admin), upload.none(),validateBody(createPronounSchema), adminPronounController.createNewPronoun);
router.post('/update/:pronounId',verifyToken(jwtAudience.admin), upload.none(), validateBody(updatePronounSchema), adminPronounController.updatePronoun);
router.get('/get/:pronounId',verifyToken(jwtAudience.admin), upload.none(), adminPronounController.getPronounById);
router.get('/get-all',verifyToken(jwtAudience.admin), upload.none(), PronounController.getAllPronoun);


module.exports = router;
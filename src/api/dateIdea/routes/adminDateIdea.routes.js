const express = require('express');
const {upload} = require('@middlewares/multer.middleware')
const {verifyToken} = require('@/middlewares/jwt.middleware')
const adminDateIdeaController = require('../controller/adminDateIdea.controller')
const DateIdeaController = require('../controller/dateIdea.controller')
const router = express.Router();


// Validation Schemas
const { validateBody } = require("@/middlewares/validate.middleware");

// JWT Audience
const { jwtAudience } = require('@config/jwt/jwt.config');
const { createDateIdeaSchema, updateDateIdeaSchema } = require('@/api/dateIdea/validator/adminDateIdea.validator');

// Routes
router.post('/create', verifyToken(jwtAudience.admin), upload.none(),validateBody(createDateIdeaSchema), adminDateIdeaController.createNewDateIdea);
router.post('/update/:dateIdeaId',verifyToken(jwtAudience.admin), upload.none(), validateBody(updateDateIdeaSchema), adminDateIdeaController.updateDateIdea);
router.get('/get/:dateIdeaId',verifyToken(jwtAudience.admin), upload.none(), adminDateIdeaController.getDateIdeaById);
router.get('/get-all',verifyToken(jwtAudience.admin), upload.none(), DateIdeaController.getAllDateIdea);


module.exports = router;
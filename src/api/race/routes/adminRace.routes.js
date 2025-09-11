const express = require('express');
const {upload} = require('@middlewares/multer.middleware')
const {verifyToken} = require('@/middlewares/jwt.middleware')
const adminRaceController = require('../controller/adminRace.controller')
const RaceController = require('../controller/race.controller')
const router = express.Router();


// Validation Schemas
const { validateBody } = require("@/middlewares/validate.middleware");

// JWT Audience
const { jwtAudience } = require('@config/jwt/jwt.config');
const { createRaceSchema, updateRaceSchema } = require('@/api/race/validator/adminRace.validator');

// Routes
router.post('/create', verifyToken(jwtAudience.admin), upload.none(),validateBody(createRaceSchema), adminRaceController.createNewRace);
router.post('/update/:raceId',verifyToken(jwtAudience.admin), upload.none(), validateBody(updateRaceSchema), adminRaceController.updateRace);
router.get('/get/:raceId',verifyToken(jwtAudience.admin), upload.none(), adminRaceController.getRaceById);
router.get('/get-all',verifyToken(jwtAudience.admin), upload.none(), RaceController.getAllRace);


module.exports = router;
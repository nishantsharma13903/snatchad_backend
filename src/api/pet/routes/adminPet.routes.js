const express = require('express');
const {upload} = require('@middlewares/multer.middleware')
const {verifyToken} = require('@/middlewares/jwt.middleware')
const adminPetController = require('../controller/adminPet.controller')
const PetController = require('../controller/pet.controller')
const router = express.Router();


// Validation Schemas
const { validateBody } = require("@/middlewares/validate.middleware");

// JWT Audience
const { jwtAudience } = require('@config/jwt/jwt.config');
const { createPetSchema, updatePetSchema } = require('@/api/pet/validator/adminPet.validator');

// Routes
router.post('/create', verifyToken(jwtAudience.admin), upload.none(),validateBody(createPetSchema), adminPetController.createNewPet);
router.post('/update/:petId',verifyToken(jwtAudience.admin), upload.none(), validateBody(updatePetSchema), adminPetController.updatePet);
router.get('/get/:petId',verifyToken(jwtAudience.admin), upload.none(), adminPetController.getPetById);
router.get('/get-all',verifyToken(jwtAudience.admin), upload.none(), PetController.getAllPet);


module.exports = router;
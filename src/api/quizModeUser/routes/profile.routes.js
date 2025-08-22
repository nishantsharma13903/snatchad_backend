const express = require('express');
const {upload} = require('@/middlewares/multer.middleware')
const {verifyToken} = require('@middlewares/jwt.middleware')
const profileController = require('../controller/profile.controller')
const router = express.Router();

// Validation Schemas
const { validateBody } = require("@/middlewares/validate.middleware");
const { profileValidationSchema } = require("../validator/profile.validator");
const { jwtAudience } = require('@config/jwt/jwt.config');

// Routes
// router.get('/get-profile',verifyToken(jwtAudience.user), upload.none(), profileController.getUserProfile);
// router.get('/get-profile-step',verifyToken(jwtAudience.user), upload.none(), profileController.getProfileStep);
// router.post('/update-profile',verifyToken(jwtAudience.user), upload.none(), validateBody(profileValidationSchema), profileController.updateProfile);
// router.post(
//   "/profile/photos-quiz",
//   verifyToken(jwtAudience.user),
//   upload.array("photos", 6), // accept exactly 6 photos
//   profileController.updatePhotosAndQuiz
// );

// Get user profile
router.get(
  "/get-profile",
  verifyToken(jwtAudience.user),
  upload.none(),
  profileController.getUserProfile
);

// Get profile step
router.get(
  "/get-profile-step",
  verifyToken(jwtAudience.user),
  upload.none(),
  profileController.getProfileStep
);

// Update profile fields
router.post(
  "/update-profile",
  verifyToken(jwtAudience.user),
  validateBody(profileValidationSchema),
  upload.none(),
  profileController.updateProfile
);

// Update photos & quiz
router.post(
  "/profile/photos-quiz",
  verifyToken(jwtAudience.user),
  upload.array("photos", 6), // accept exactly 6 files
  profileController.updatePhotosAndQuiz
);


module.exports = router;
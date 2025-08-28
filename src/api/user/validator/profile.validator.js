const Joi = require("joi");

const profileValidationSchema = Joi.object({
  // Step 1: Basic Details
  firstName: Joi.string().trim().min(2).max(50).messages({
    "string.empty": "First name is required",
    "string.min": "First name must be at least 2 characters",
  }),
  lastName: Joi.string().trim().min(2).max(50).messages({
    "string.empty": "Last name is required",
    "string.min": "Last name must be at least 2 characters",
  }),

  // Step 2: DOB
  dob: Joi.date().less("now").messages({
    "date.base": "Invalid date format",
    "date.less": "Date of birth must be in the past",
  }),

  // Step 3: Identity
  gender: Joi.string().min(2).max(20).messages({
    "string.base": "Gender must be string",
    "string.min": "Gender must have at least 2 character",
    "string.base": "Gender can't have more than 20 characters",
  }),
  sexuality: Joi.string().min(2).max(20).messages({
    "string.base": "Sexuality must be string",
    "string.min": "Sexuality must have at least 2 character",
    "string.base": "Sexuality can't have more than 20 characters",
  }),

  // Step 4: Height
  height: Joi.string().messages({
    "string.base": "Height must be a string",
  }),

  // Step 5: Goals
  goals: Joi.array().items(Joi.string()).min(1).messages({
    "array.min": "At least one goal is required",
  }),

  // Step 6: Interests + Looking For
  interests: Joi.string().messages({
    "array.min": "At least one interest is required",
  }),
  relationship: Joi.string().messages({
    "string.base": "Relationship must be string",
  }),

  // Step 7: Hobbies
  hobbies: Joi.array().items(Joi.string()).min(1).messages({
    "array.min": "At least one hobby is required",
  }),

  // Step 8: Location
  location: Joi.object({
    type: Joi.string().valid("Point").required(),
    coordinates: Joi.array().items(Joi.number()).length(2).required(),
  }).messages({
    "any.required": "Location is required",
  }),

  // Step 9: Photos
  photos: Joi.array().items(Joi.string()).min(1),

  // Step 10: Quiz
  quizScore: Joi.number().min(0).max(100),
});

// Mode-aware photo + quiz validation
const getPhotoQuizSchemaByMode = (mode) => {
  let maxPhotos = 6;
  let requireQuiz = false;

  if (mode === "quiz") {
    maxPhotos = 6;
    requireQuiz = false; // optional quiz score
  } else if (mode === "versus") {
    maxPhotos = 3;
  } else if (mode === "snatched") {
    maxPhotos = 4;
  }

  return Joi.object({
    mainPhotoIndex: Joi.number()
      .integer()
      .min(0)
      .max(maxPhotos - 1)
      .optional()
      .messages({
        // "any.required": "Main photo index is required.",
        "number.base": "Main photo index must be a number.",
        "number.min": `Main photo index must be between 0–${maxPhotos - 1}.`,
        "number.max": `Main photo index must be between 0–${maxPhotos - 1}.`,
      }),
    quizScore: requireQuiz
      ? Joi.number().integer().min(0).max(100).required()
      : Joi.number().integer().min(0).max(100).optional(),
  });
};

module.exports = {
  profileValidationSchema,
  getPhotoQuizSchemaByMode,
};

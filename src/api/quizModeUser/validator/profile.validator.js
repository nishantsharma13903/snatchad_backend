const Joi = require("joi");

// Basic profile schemas
// const profileValidationSchema = {
//   basicDetails: Joi.object({
//     firstName: Joi.string().trim().min(2).max(50).required().messages({
//       "string.empty": "First name is required",
//       "string.min": "First name must be at least 2 characters",
//       "any.required": "First name is required"
//     }),
//     lastName: Joi.string().trim().min(2).max(50).required().messages({
//       "string.empty": "Last name is required",
//       "string.min": "Last name must be at least 2 characters",
//       "any.required": "Last name is required"
//     }),
//   }),
//   dob: Joi.object({
//     dob: Joi.date().less("now").required().messages({
//       "date.base": "Invalid date format",
//       "date.less": "Date of birth must be in the past",
//       "any.required": "Date of birth is required"
//     }),
//   }),
//   identity: Joi.object({
//     identity: Joi.string().valid("male", "female", "trans", "non-binary").required().messages({
//       "any.only": "Identity must be male, female, transgender, or non-binary",
//       "any.required": "Identity is required"
//     }),
//     sexuality: Joi.string().valid("straight", "gay", "lesbian", "bisexual", "asexual").required().messages({
//       "any.only": "Sexuality must be one of straight, gay, lesbian, bisexual, or asexual",
//       "any.required": "Sexuality is required"
//     }),
//   }),
//   height: Joi.object({
//     height: Joi.number().min(100).max(250).required().messages({
//       "number.base": "Height must be a number",
//       "number.min": "Height must be at least 100 cm",
//       "number.max": "Height cannot exceed 250 cm",
//       "any.required": "Height is required"
//     }),
//   }),
//   goals: Joi.object({
//     goals: Joi.array().items(Joi.string()).min(1).required().messages({
//       "array.base": "Goals must be an array",
//       "array.min": "At least one goal is required",
//       "any.required": "Goals are required"
//     }),
//   }),
//   interests: Joi.object({
//     interests: Joi.array().items(Joi.string()).min(1).required(),
//     lookingFor: Joi.array().items(Joi.string()).min(1).required(),
//   }).messages({
//     "array.base": "Interests/Looking For must be an array",
//     "array.min": "At least one value is required",
//     "any.required": "This field is required"
//   }),
//   hobbies: Joi.object({
//     hobbies: Joi.array().items(Joi.string()).min(1).required(),
//   }).messages({
//     "array.min": "At least one hobby is required",
//     "any.required": "Hobbies are required"
//   }),
//   location: Joi.object({
//     location: Joi.object({
//       type: Joi.string().valid("Point").required(),
//       coordinates: Joi.array().items(Joi.number()).length(2).required()
//     }).required().messages({
//       "any.required": "Location is required"
//     }),
//   }),
// };

const profileValidationSchema = Joi.object({
  // Step 1: Basic Details
  firstName: Joi.string().trim().min(2).max(50).messages({
    "string.empty": "First name is required",
    "string.min": "First name must be at least 2 characters"
  }),
  lastName: Joi.string().trim().min(2).max(50).messages({
    "string.empty": "Last name is required",
    "string.min": "Last name must be at least 2 characters"
  }),

  // Step 2: DOB
  dob: Joi.date().less("now").messages({
    "date.base": "Invalid date format",
    "date.less": "Date of birth must be in the past"
  }),

  // Step 3: Identity
  identity: Joi.string().valid("male", "female", "trans", "non-binary").messages({
    "any.only": "Identity must be male, female, trans, or non-binary"
  }),
  sexuality: Joi.string().valid("straight", "gay", "lesbian", "bisexual", "asexual").messages({
    "any.only": "Sexuality must be straight, gay, lesbian, bisexual, or asexual"
  }),

  // Step 4: Height
  height: Joi.number().min(100).max(250).messages({
    "number.base": "Height must be a number",
    "number.min": "Height must be at least 100 cm",
    "number.max": "Height cannot exceed 250 cm"
  }),

  // Step 5: Goals
  goals: Joi.array().items(Joi.string()).min(1).messages({
    "array.min": "At least one goal is required"
  }),

  // Step 6: Interests + Looking For
  interests: Joi.string().messages({
    "array.min": "At least one interest is required"
  }),
  lookingFor: Joi.array().items(Joi.string()).min(1).messages({
    "array.min": "At least one 'looking for' value is required"
  }),

  // Step 7: Hobbies
  hobbies: Joi.array().items(Joi.string()).min(1).messages({
    "array.min": "At least one hobby is required"
  }),

  // Step 8: Location
  location: Joi.object({
    type: Joi.string().valid("Point").required(),
    coordinates: Joi.array().items(Joi.number()).length(2).required()
  }).messages({
    "any.required": "Location is required"
  }),

  // Step 9: Photos
  photos: Joi.array().items(Joi.string()).min(1),

  // Step 10: Quiz
  quizScore: Joi.number().min(0).max(100)
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
      .required()
      .messages({
        "any.required": "Main photo index is required.",
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
  getPhotoQuizSchemaByMode
};

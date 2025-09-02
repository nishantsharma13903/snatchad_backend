// validator/quizAttempt.validator.js
const Joi = require("joi");

const attemptQuizSchema = Joi.object({
  quizId: Joi.string().required().messages({
    "any.required": "Quiz ID is required",
  }),
  answers: Joi.array()
    .items(
      Joi.object({
        questionId: Joi.string().required().messages({
          "any.required": "Question ID is required",
        }),
        selectedOptions: Joi.array()
          .items(Joi.number().min(0))
          .required()
          .messages({
            "any.required": "Selected options are required",
          }),
      })
    )
    .min(1)
    .required(),
});

module.exports = { attemptQuizSchema };

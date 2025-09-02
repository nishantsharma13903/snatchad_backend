const Joi = require("joi");

const yesNoOptionsSchema = Joi.array().items(Joi.string().trim().min(1)).length(2);
const mcqOptionsSchema = Joi.array().items(Joi.string().trim().min(1)).min(1).max(6);

const questionBase = {
  questionText: Joi.string().min(2).max(500).required(),
  points: Joi.number().integer().min(0).default(1),
  correctAnswers: Joi.array().items(Joi.number().integer().min(0)).min(1).required(),
};

const yesNoQuestionSchema = Joi.object({
  ...questionBase,
  type: Joi.string().valid("YES_NO").required(),
  options: yesNoOptionsSchema.required(),
});

const mcqQuestionSchema = Joi.object({
  ...questionBase,
  type: Joi.string().valid("MULTIPLE_CHOICE").required(),
  options: mcqOptionsSchema.required(),
});

const questionSchema = Joi.alternatives().try(yesNoQuestionSchema, mcqQuestionSchema);

const createQuizSchema = Joi.object({
  title: Joi.string().min(2).max(120).required(),
  description: Joi.string().allow("").max(1000).default(""),
  status: Joi.string().valid("Draft", "Active").default("Draft"),
  questions: Joi.array().items(questionSchema).min(1).required(),
}).custom((value, helpers) => {
  // validate indexes within options length
  for (const q of value.questions) {
    const maxIndex = (q.options?.length ?? 0) - 1;
    if (!q.correctAnswers.every(i => i >= 0 && i <= maxIndex)) {
      return helpers.error("any.invalid", "correctAnswers index out of range");
    }
    if (q.type === "YES_NO" && q.options.length !== 2) {
      return helpers.error("any.invalid", "YES_NO must have exactly 2 options");
    }
    if (q.type === "MULTIPLE_CHOICE" && (q.options.length < 1 || q.options.length > 6)) {
      return helpers.error("any.invalid", "MULTIPLE_CHOICE must have 1..6 options");
    }
  }
  return value;
});

const updateQuizStatusSchema = Joi.object({
  status: Joi.string().valid("Draft", "Active", "Deleted").required(),
});

const submitQuizSchema = Joi.object({
  quizId: Joi.string().required(),
  answers: Joi.array()
    .items(
      Joi.object({
        questionId: Joi.string().required(),
        selectedOptions: Joi.array().items(Joi.number().integer().min(0)).default([]),
      })
    )
    .min(1)
    .required(),
});

module.exports = {
  createQuizSchema,
  updateQuizStatusSchema,
  submitQuizSchema,
};

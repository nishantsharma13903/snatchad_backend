// validators/subscriptionValidator.js
const Joi = require("joi");

exports.createSubscriptionSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow(""),
  price: Joi.number().required(),
  currency: Joi.string().default("USD"),
  billingCycle: Joi.string().valid("one_time", "monthly", "yearly").required(),
  tokens: Joi.number().default(0),
  dailyBonusTokens: Joi.number().default(0),
});

exports.purchaseSubscriptionSchema = Joi.object({
  subscriptionId: Joi.string().required(),
});

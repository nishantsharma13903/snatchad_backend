// controllers/subscriptionController.js
const ResponseHandler = require("@/utils/response/responseHandler.utils");
const subscriptionService = require("../services/subscription.services");


exports.createSubscription = async (req, res) => {
  try {
    const plan = await subscriptionService.createSubscription(req.body);
    return ResponseHandler.success(res, "Subscription created", 201, plan);
  } catch (err) {
    return ResponseHandler.error(res, err.message, 400, {});
  }
};

exports.getAllSubscriptions = async (req, res) => {
  try {
    const plans = await subscriptionService.getAllSubscriptions();
    return ResponseHandler.success(res, "Subscriptions fetched", 200, plans);
  } catch (err) {
    return ResponseHandler.error(res, err.message, 400, {});
  }
};

exports.purchaseSubscription = async (req, res) => {
  try {
    const userId = req.token._id;
    const { subscriptionId } = req.body;
    const userSub = await subscriptionService.purchaseSubscription(userId, subscriptionId);
    return ResponseHandler.success(res, "Subscription purchased", 200, userSub);
  } catch (err) {
    return ResponseHandler.error(res, err.message, 400, {});
  }
};

exports.getUserSubscriptions = async (req, res) => {
  try {
    const userId = req.token._id;
    const subs = await subscriptionService.getUserSubscriptions(userId);
    return ResponseHandler.success(res, "User subscriptions fetched", 200, subs);
  } catch (err) {
    return ResponseHandler.error(res, err.message, 400, {});
  }
};

exports.getActiveUserSubscription = async (req, res) => {
  try {
    const userId = req.token._id;
    const sub = await subscriptionService.getActiveUserSubscription(userId);
    return ResponseHandler.success(res, "Active subscription fetched", 200, sub);
  } catch (err) {
    return ResponseHandler.error(res, err.message, 400, {});
  }
};

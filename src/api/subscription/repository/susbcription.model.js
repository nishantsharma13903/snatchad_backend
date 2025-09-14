// repositories/subscriptionRepo.js
const Subscription = require("../model/subscription.model");
const UserSubscription = require("../model/userSubscription.model");

exports.createSubscription = (data) => Subscription.create(data);
exports.getSubscriptions = (filter = {}) => Subscription.find(filter);
exports.getSubscriptionById = (id) => Subscription.findById(id);
exports.updateSubscription = (id, data) =>
  Subscription.findByIdAndUpdate(id, data, { new: true });
exports.deleteSubscription = (id) => Subscription.findByIdAndDelete(id);

// User Subscriptions
exports.createUserSubscription = (data) => UserSubscription.create(data);
exports.getUserSubscriptions = (userId) =>
  UserSubscription.find({ userId }).populate("subscriptionId");
exports.getActiveUserSubscription = (userId) =>
  UserSubscription.findOne({ userId, status: "active" }).populate("subscriptionId");

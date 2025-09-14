// services/subscriptionService.js
const subscriptionRepo = require("../repository/susbcription.model");

exports.createSubscription = async (data) => {
  return await subscriptionRepo.createSubscription(data);
};

exports.getAllSubscriptions = async () => {
  return await subscriptionRepo.getSubscriptions({ isActive: true });
};

exports.purchaseSubscription = async (userId, subscriptionId) => {
  const plan = await subscriptionRepo.getSubscriptionById(subscriptionId);
  if (!plan || !plan.isActive) {
    throw new Error("Subscription not available");
  }

  //   let endDate = null;
  //   if (plan.billingCycle === "monthly") {
  //     endDate = new Date();
  //     endDate.setMonth(endDate.getMonth() + 1);
  //   } else if (plan.billingCycle === "yearly") {
  //     endDate = new Date();
  //     endDate.setFullYear(endDate.getFullYear() + 1);
  //   }

  let endDate = new Date(); // set start point to now

  switch ((plan.billingCycle || "").toLowerCase()) {
    case "monthly":
      endDate.setMonth(endDate.getMonth() + 1);
      break;
    case "yearly":
      endDate.setFullYear(endDate.getFullYear() + 1);
      break;
    default:
      endDate = null; // or throw an error if billingCycle is invalid
      break;
  }

  return await subscriptionRepo.createUserSubscription({
    userId,
    subscriptionId,
    endDate,
  });
};

exports.getUserSubscriptions = async (userId) => {
  return await subscriptionRepo.getUserSubscriptions(userId);
};

exports.getActiveUserSubscription = async (userId) => {
  return await subscriptionRepo.getActiveUserSubscription(userId);
};

// routes/subscriptionRoutes.js
const express = require("express");
const router = express.Router();
const subscriptionController = require("../controller/subscription.controller");
const {
  createSubscriptionSchema,
  purchaseSubscriptionSchema,
} = require("../validator/subscription.validator");
const { validateBody } = require("@/middlewares/validate.middleware");
const { verifyToken } = require("@/middlewares/jwt.middleware");
const { jwtAudience } = require("@/config/jwt/jwt.config");
const { upload } = require("@/middlewares/multer.middleware");

// Admin: create subscription
router.post(
  "/admin/create",
  verifyToken(jwtAudience.admin),
  upload.none(),
  validateBody(createSubscriptionSchema),
  subscriptionController.createSubscription
);

// Public: get all subscriptions
router.get(
  "/get-all/users",
  verifyToken(jwtAudience.user),
  upload.none(),
  subscriptionController.getAllSubscriptions
);
router.get(
  "/get-all/admin",
  verifyToken(jwtAudience.admin),
  upload.none(),
  subscriptionController.getAllSubscriptions
);

// User: purchase subscription
router.post(
  "/purchase",
  verifyToken(jwtAudience.user),
  upload.none(),
  validateBody(purchaseSubscriptionSchema),
  subscriptionController.purchaseSubscription
);

// User: get my subscriptions
router.get(
  "/my-subscriptions",
  verifyToken(jwtAudience.user),
  upload.none(),
  subscriptionController.getUserSubscriptions
);

// User: get active subscription
router.get(
  "/my-active",
  verifyToken(jwtAudience.user),
  upload.none(),
  subscriptionController.getActiveUserSubscription
);

module.exports = router;

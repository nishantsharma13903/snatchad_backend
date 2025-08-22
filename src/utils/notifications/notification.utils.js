const admin = require('../../config/firebase/firebase.config');
const logger = require('../logger/logger.utils');

// Send notification to a device token
exports.sendNotificationToUser = async (deviceToken, title, body,imageUrl, data,actionPage) => {
  const message = {
    token: deviceToken,
    notification: {
      title: title,
      body: body,
      image: imageUrl,  // URL or path to the image file
    },
    android: {
      notification: {
        channel_id: 'snatched', // Specify your channel ID here
      }
    },
    apns: {
      payload: {
        aps: {
          alert: {
            title: title,
            body: body,
          },
          sound: 'default',
          badge: 1,  // Optional: Badge count on the app icon
          'mutable-content': 1  // Required for rich notifications (images, etc.)
        },
      },
      fcm_options: {
        image: imageUrl  // URL or path to the image file
      }
    },
    data: {
      ...data,
      click_action: actionPage  // Custom action
    },
  };

  try {
    const response = await admin.messaging().send(message);
    logger.info('Successfully sent message:', response);
    return {
      success : 1,
      result : response,
      payload : message
    }
  } catch (error) {
    logger.error('Error sending message:', error);
    return {
      success : 0,
      result : error,
      payload : message
    };
  }
};
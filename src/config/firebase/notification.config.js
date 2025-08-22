require('dotenv').config();


module.exports = {
    notificationToAll : process.env.NOTIFICATION_TO_ALL || 'SNATCHED_NOTIFICATION'
}
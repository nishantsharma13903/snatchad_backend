require("dotenv").config();

module.exports = {
    limits : {
        verifyLimit30S: parseInt(process.env.ADMIN_VERIFY_LIMIT_30S) || 3,
        verifyLimitHour: parseInt(process.env.ADMIN_VERIFY_LIMIT_HOUR) || 5,
        verifyLimitDay: parseInt(process.env.ADMIN_VERIFY_LIMIT_DAY) || 12,
    },
    window: {
        verifyWindow30S: parseInt(process.env.ADMIN_VERIFY_WINDOW_30S) || 30,
        verifyWindowHour: parseInt(process.env.ADMIN_VERIFY_WINDOW_HOUR) || 3600,
        verifyWindowDay: parseInt(process.env.ADMIN_VERIFY_WINDOW_DAY) || 86400
    }
}
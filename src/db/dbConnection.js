const mongoose = require('mongoose');
const logger = require('../utils/logger/logger.utils');
require('dotenv').config();

const connectDB = async () => {
    try {
        const instance = await mongoose.connect(process.env.DB_URL);

        const host = instance.connection.host;

        logger.info(`✅ MongoDB Connected Successfully`)

    } catch (error) {
        logger.error("😔 MongoDB Error : ",error);
        process.exit(1);
    }
}

module.exports = connectDB;
// Registering modules
require('module-alias/register');

// index.js
// require("dotenv").config();
const dotenv = require('dotenv');
const path = require('path');

// Load env file based on NODE_ENV
const envFile = process.env.NODE_ENV === 'production'
  ? '.env.prod'
  : '.env.dev';

dotenv.config({ path: path.resolve(process.cwd(), envFile) });

console.log(`Running in ${process.env.NODE_ENV || 'development'} mode`);

const app = require("./src/app");
const connectDB = require("./src/db/dbConnection");
const logger = require("./src/utils/logger/logger.utils");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      logger.info(`⚙️  Server is listening on port ${PORT}`);
    });
  } catch (err) {
    logger.error("❌ Failed to start server:", err);
    process.exit(1); // Exit the app if DB connection fails
  }
};

startServer();
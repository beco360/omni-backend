/** Dependencies */
const mongoose = require("mongoose");
const logger = require("../utils/logger");

/** Global variables */
const DB_URI = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`

module.exports = async function () {
  await mongoose.connect(DB_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
    .then(() => {
      logger.info("Database connected successfully");
    })
    .catch(error => {
      logger.alert(`Database connection failed: ${error.message}`);
    });
};
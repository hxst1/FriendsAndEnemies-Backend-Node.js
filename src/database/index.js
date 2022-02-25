const debug = require("debug")("social: database");
const chalk = require("chalk");
const mongoose = require("mongoose");

const connectMongoDB = (connectionString) =>
  new Promise((resolve, reject) => {
    mongoose.set("toJSON", {
      virtuals: true,
      transform: (doc, ret) => {
        // eslint-disable-next-line no-param-reassign, no-underscore-dangle
        delete ret._id;
        // eslint-disable-next-line no-param-reassign, no-underscore-dangle
        delete ret.__v;
      },
    });
    mongoose.connect(connectionString, (error) => {
      if (error) {
        reject(new Error(chalk.bgRed(`Conection refused: ${error.message}`)));
        return;
      }
      debug(chalk.green(chalk.green("Connection Successful")));
      resolve();
    });
  });

module.exports = connectMongoDB;

require("dotenv").config();
const debug = require("debug")("social: root");
const chalk = require("chalk");
const connectMongoDB = require("./database");
const app = require("./server");
const startServer = require("./server/startServer");

const port = process.env.PORT || 4444;
const connectionString = process.env.MONGO_STRING;

(async () => {
  try {
    await startServer(app, port);
    await connectMongoDB(connectionString);
  } catch (error) {
    debug(chalk.red("Error: ", error.message));
  }
})();

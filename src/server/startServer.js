const chalk = require("chalk");
const debug = require("debug")("social: server");

const startServer = (app, port) =>
  new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      debug(chalk.bold.green(`Server is listening on ${port}`));
      resolve();
    });

    server.on("error", (error) => {
      debug(chalk.bold.red(`The server have an error ${error}`));
      reject(error);
    });
  });

module.exports = startServer;

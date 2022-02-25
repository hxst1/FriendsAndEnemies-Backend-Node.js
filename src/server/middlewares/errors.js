const debug = require("debug")("social: server: middlewares: errors");
const chalk = require("chalk");

// eslint-disable-next-line no-unused-vars
const generalError = (err, req, res, next) => {
  debug(chalk.red(`Error: ${err.message}`));
  const errorCode = err.code ?? 500;
  const errorMessage = err.code ? err.message : "General peting";
  res.status(errorCode).json({ error: true, message: errorMessage });
};

const notFoundError = (req, res) => {
  res
    .status(404)
    .json({ error: true, message: "Error 404. Endpoint not found" });
};

module.exports = { notFoundError, generalError };

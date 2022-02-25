const express = require("express");
const morgan = require("morgan");
const { generalError, notFoundError } = require("./middlewares/errors");

const app = express();

app.use(morgan("dev"));
app.use(express.json());

app.use(generalError);
app.use(notFoundError);

module.exports = app;

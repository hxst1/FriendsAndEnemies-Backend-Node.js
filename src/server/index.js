const express = require("express");
const morgan = require("morgan");
const { generalError, notFoundError } = require("./middlewares/errors");
const userRoute = require("./routers/userRouter");

const app = express();

app.use(morgan("dev"));
app.use(express.json());

app.use("/users", userRoute);

app.use(generalError);
app.use(notFoundError);

module.exports = app;

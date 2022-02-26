require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../database/models/User");

const userLogin = async (req, res, next) => {
  const { username, password } = req.body;
  const findUser = await User.findOne({ username });

  if (!findUser) {
    const error = new Error("User not found");
    error.code = 401;
    return next(error);
  }

  const rightPassword = await bcrypt.compare(password, findUser.password);

  if (!rightPassword) {
    const error = new Error("Invalid password");
    error.code = 401;
    return next(error);
  }

  const UserData = {
    name: findUser.name,
    id: findUser.id,
  };

  const token = jwt.sign(UserData, process.env.JWT_SECRET);
  return res.json({ token });
};

const userRegister = async (req, res, next) => {
  const { name, username, password } = req.body;

  if (!name || !username || !password) {
    const error = new Error("Register not found");
    error.code = 400;
    return next(error);
  }

  const findNewUser = await User.findOne({ username });
  if (findNewUser) {
    const error = new Error("This username already exists");
    error.code = 400;
    return next(error);
  }

  const encryptedPassword = await bcrypt.hash(password, +process.env.SALT);
  req.body.password = encryptedPassword;
  const userdata = await User.create(req.body);
  return res.status(201).json(userdata);
};
module.exports = { userLogin, userRegister };

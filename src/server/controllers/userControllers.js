require("dotenv").config();
const debug = require("debug")("social: userController");
const chalk = require("chalk");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
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
  const { username, password, name } = req.body;
  try {
    const encryptedPassword = await bcrypt.hash(password, +process.env.SALT);
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      const error = new Error(`Username ${username} already exists!`);
      error.code = 400;
      next(error);
      return;
    }
    const oldFileName = path.join("uploads", req.file.filename);
    const newFileName = path.join("uploads", req.file.originalname);
    fs.rename(oldFileName, newFileName, () => {});
    const newUser = await User.create({
      username,
      password: encryptedPassword,
      name,
      image: newFileName,
    });
    debug(chalk.cyanBright(`User created with username: ${newUser.username}`));
    res.status(201);
    res.json({ message: `User registered with username: ${newUser.username}` });
  } catch (error) {
    fs.unlink(path.join("uploads", req.file.filename), () => {
      error.code = 400;
      next(error);
    });
  }
};

const getAllUsers = async (req, res) => {
  const headerAuth = req.header("Authorization");
  const token = headerAuth.replace("Bearer ", "");
  const { id } = jwt.verify(token, process.env.JWT_SECRET);

  const users = await User.find();
  const actualUser = await User.findById(id);
  const returnedUsers = users.filter((user) => user.id !== actualUser.id);
  res.status(200).json({ returnedUsers });
};

const getUser = async (req, res) => {
  const headerAuth = req.header("Authorization");
  const token = headerAuth.replace("Bearer ", "");
  const { id } = jwt.verify(token, process.env.JWT_SECRET);

  const actualUser = await User.findById(id);
  res.status(200).json({ actualUser });
};

module.exports = { userLogin, userRegister, getAllUsers, getUser };

require("dotenv").config();
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
  try {
    const oldPath = path.join("uploads/", req.file.filename);
    const newPath = path.join("uploads/", req.body.username);
    fs.rename(oldPath, newPath, (error) => {
      if (error) {
        next(error);
      }
    });
    req.body.image = newPath;

    const { username, password, name, image } = req.body;

    if (!name || !username || !password || !image) {
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
  } catch (error) {
    return next(error);
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

require("dotenv").config();
const bcrypt = require("bcrypt");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const connectMongoDB = require("../../database");
const User = require("../../database/models/User");
const { userLogin } = require("./userControllers");

jest.mock("jsonwebtoken", () => ({
  ...jest.requireActual("jsonwebtoken"),
  sign: jest.fn().mockReturnValue("token"),
}));

let server;
beforeAll(async () => {
  server = await MongoMemoryServer.create();
  const uri = server.getUri();
  connectMongoDB(uri);
});

beforeEach(async () => {
  const cryptPassword = await bcrypt.hash("1234", 2);
  await User.create({
    name: "edu",
    username: "eya",
    password: cryptPassword,
  });
});

afterEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
  await server.stop();
});

describe("Given a login user controller", () => {
  describe("When it recives a request", () => {
    test("Then if the user exist should receives a token", async () => {
      jest.setTimeout(5000);
      const res = {
        json: jest.fn(),
      };
      const req = { body: { username: "eya", password: "1234" } };
      const token = "token";

      await userLogin(req, res);

      expect(res.json).toHaveBeenCalledWith({ token });
    });

    test("Then if the username or the password is wrong it should return an error", async () => {
      const req = { body: { username: "eya", password: "1235" } };
      const next = jest.fn();
      const error = new Error("Invalid password");

      await userLogin(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    test("Then if the username not found should return an error", async () => {
      const req = { body: { username: "", password: "1234" } };
      const next = jest.fn();
      const error = new Error("User not found");

      await userLogin(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});

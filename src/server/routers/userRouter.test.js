const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const request = require("supertest");
const connectToMongoDB = require("../../database");
const User = require("../../database/models/User");
const app = require("../index");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const connectionString = mongoServer.getUri();

  await connectToMongoDB(connectionString);
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.create({
    name: "user1",
    username: "username1",
    password: "$2b$10$KgrIhPGAY12Xy/NPdUdLzubUtsCe0VV42YqPj6mk.sb.8.blGOg7W",
    admin: true,
    series: [],
  });
});

afterEach(async () => {
  await User.deleteMany({});
});

describe("Given a /login endpoint", () => {
  describe("When it receives a POST request with an username and password", () => {
    test("Then it should return a token", async () => {
      const user = {
        username: "username1",
        password: "user1",
      };

      const { body } = await request(app)
        .post("/users/login")
        .send(user)
        .expect(200);

      expect(body).toHaveProperty("token");
    });
  });

  describe("When it receives a POST request with a wrong username and password", () => {
    test("Then it should return a 401 status", async () => {
      const user = {
        name: "user1",
        username: "wrongUsername",
        password: "user1",
      };

      await request(app).post("/users/login").send(user).expect(401);
    });
  });

  describe("When it receives a POST request with a username and wrong password", () => {
    test("Then it should return a 401 status", async () => {
      const user = {
        username: "username1",
        password: "wrongPassword",
      };

      await request(app).post("/users/login").send(user).expect(401);
    });
  });
});

describe("Given a /users/resgister endpoint", () => {
  describe("When it receives a POST request with a new user", () => {
    test("Then it should return a 200 status and the new user", async () => {
      const user = {
        name: "user2",
        username: "username2",
        password: "user2",
        img: "",
      };

      await request(app).post("/users/register").send(user).expect(201);
    });
  });

  describe("When it receives a POST request with a repeated user", () => {
    test("Then it should return a 401 status and the new user", async () => {
      const user = {
        name: "user1",
        username: "username1",
        password: "",
      };

      await request(app).post("/users/register").send(user).expect(400);
    });
  });

  describe("When it receives a POST request with wrong password", () => {
    test("Then it should return a 401 status and the new user", async () => {
      const user = {
        name: "user1",
        username: "username1",
        password: "",
        img: "",
      };

      await request(app).post("/users/register").send(user).expect(400);
    });
  });

  describe("When it receives a POST request with wrong password", () => {
    test("Then it should return a 401 status and the new user", async () => {
      const user = {
        name: "user1",
        username: "username1",
        password: "1234",
        img: "",
      };

      await request(app).post("/users/register").send(user).expect(400);
    });
  });

  describe("When it receives a POST request with wrong endpoint", () => {
    test("Then it should return a 404 status with not found error", async () => {
      const { body } = await request(app).post("/users/regir").expect(404);

      expect(body).toHaveProperty("message", "Error 404. Endpoint not found");
    });
  });
});

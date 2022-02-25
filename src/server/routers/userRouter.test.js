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
    name: "edu",
    username: "eya",
    password: "$2b$10$laCaZqCDy0vQOy/DKlG6/OFsnGVCpXJaR/0ktlYDKG6Z58BsWBpIK",
  });
});

afterEach(async () => {
  await User.deleteMany({});
});

describe("Given a /login endpoint", () => {
  describe("When it receives a POST request with an username and password", () => {
    test("Then it should return a token and status 200", async () => {
      const user = {
        username: "eya",
        password: "1234",
      };

      const { body } = await request(app)
        .post("/users/login")
        .send(user)
        .expect(200);

      expect(body).toHaveProperty("token");
    });
  });
});

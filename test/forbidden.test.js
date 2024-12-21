const request = require("supertest");
const { faker } = require("@faker-js/faker");
const app = require("../app");
const generate = require("./utils/generate");
const { default: mongoose } = require("mongoose");

let USER_ID = null;
let USER_TOKEN = null;

const USER_EMAIL = generate("email", () => faker.internet.email());
const USER_PASSWORD = generate("password", () =>
  faker.internet.password(10, true)
);

describe("Forbidden check", () => {
  before(async () => {
    const { expect } = await import("chai");

    expect(global.SUPER_ADMIN_TOKEN).to.not.equal(undefined);

    const user_response = await request(app)
      .post("/api/user/createUser")
      .set({
        token: global.SUPER_ADMIN_TOKEN,
      })
      .send({
        username: generate("username", () => faker.internet.username()),
        email: USER_EMAIL,
        role: generate("role", () => "admin"),
        password: USER_PASSWORD,
      });

    expect(user_response.status).equal(201);

    USER_ID = user_response.body.data._id;

    const token_response = await request(app)
      .post("/api/user/auth")
      .set({
        Authorization: `Basic ${Buffer.from(
          `${USER_EMAIL}:${USER_PASSWORD}`
        ).toString("base64")}`,
      })
      .send();

    expect(token_response.status).equal(200);

    USER_TOKEN = token_response.body.data;
  });

  describe("Create user by school administrator", () => {
    it("should return a 403 status code response", async () => {
      const { expect } = await import("chai");

      const response = await request(app)
        .post("/api/user/createUser")
        .set({
          token: USER_TOKEN,
        })
        .send({
          username: generate("username", () => faker.internet.username()),
          email: generate("email", () => faker.internet.email()),
          role: generate("role", () => "admin"),
          password: generate("password", () =>
            faker.internet.password(10, true)
          ),
        });

      expect(response.status).equal(403);
    });
  });

  describe("Create school by school administrator", () => {
    it("should return a 403 status code response", async () => {
      const { expect } = await import("chai");

      const response = await request(app)
        .post("/api/school/createSchool")
        .set({
          token: USER_TOKEN,
        })
        .send({
          name: generate("name", () => faker.company.name()),
          address: generate("address", () => faker.location.streetAddress()),
          phone: generate("phone", () => "+1234567890"),
          email: generate("email", () => faker.internet.email()),
          type: generate("type", () =>
            faker.helpers.arrayElement(["public", "private"])
          ),
          website: generate("website", () => faker.internet.url()),
        });

      expect(response.status).equal(403);
    });
  });

  after(async () => {
    const { expect } = await import("chai");

    expect(USER_ID).to.not.equal(null);
    expect(mongoose.Types.ObjectId.isValid(USER_ID));

    const response = await request(app)
      .delete("/api/user/deleteUser")
      .query({ id: USER_ID })
      .set({
        token: global.SUPER_ADMIN_TOKEN,
      })
      .send();

    expect(response.status).equal(200);
    expect(response.body.message).equal("User deleted successfully");
  });
});

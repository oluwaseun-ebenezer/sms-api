const request = require("supertest");
const { faker } = require("@faker-js/faker");
const app = require("../app");
const generate = require("./utils/generate");

describe("Seed Initial SuperAdmin", () => {
  it("should return a 201 status code response", async () => {
    const { expect } = await import("chai");

    global.SUPER_ADMIN_EMAIL = generate("email", () => faker.internet.email());
    global.SUPER_ADMIN_PASSWORD = generate("password", () =>
      faker.internet.password(10, true)
    );

    const response = await request(app)
      .post("/api/seed/createDefaultSuperAdmin")
      .send({
        username: generate("username", () => faker.internet.username()),
        email: global.SUPER_ADMIN_EMAIL,
        role: "superadmin",
        password: global.SUPER_ADMIN_PASSWORD,
      });

    expect(response.status).equal(201);
    expect(response.body.data.role).equal("superadmin");
    expect(response.body.message).equal(
      "Default superadmin seeded successfully"
    );

    global.SUPER_ADMIN_ID = response.body.data._id;
  });
});

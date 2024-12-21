const request = require("supertest");
const { faker } = require("@faker-js/faker");
const app = require("../app");
const generate = require("./utils/generate");
const { default: mongoose } = require("mongoose");

let health_ok = false;
let USER_ID = null;

describe("User module", () => {
  before(async () => {
    const { expect } = await import("chai");

    expect(global.SUPER_ADMIN_TOKEN).to.not.equal(undefined);
  });

  describe("Health check", () => {
    it("should return a 200 status code response", async () => {
      const { expect } = await import("chai");

      const response = await request(app)
        .head("/api/user/health")
        .set({
          token: global.SUPER_ADMIN_TOKEN,
        })
        .send();

      if (response.status == 200) {
        health_ok = true;
      }

      expect(response.status).equal(200);
    });
  });

  describe("Create a User", () => {
    before(async () => {
      const { expect } = await import("chai");

      expect(health_ok).equal(true);
    });

    it("should return a 201 status code response", async () => {
      const { expect } = await import("chai");

      const response = await request(app)
        .post("/api/user/createUser")
        .set({
          token: global.SUPER_ADMIN_TOKEN,
        })
        .send({
          username: generate("username", () => faker.internet.username()),
          email: generate("email", () => faker.internet.email()),
          role: generate("role", () => "admin"),
          password: generate("password", () =>
            faker.internet.password(10, true)
          ),
        });

      expect(response.status).equal(201);
      expect(response.body.message).equal("User created successfully");

      USER_ID = response.body.data._id;
    });
  });

  describe("Get All Users", () => {
    before(async () => {
      const { expect } = await import("chai");

      expect(health_ok).equal(true);
    });

    it("should return a 200 status code response", async () => {
      const { expect } = await import("chai");

      const response = await request(app)
        .get("/api/user/getUsers")
        .query({ page: 1, limit: 10 })
        .set({
          token: global.SUPER_ADMIN_TOKEN,
        })
        .send();

      expect(response.status).equal(200);
      expect(response.body.data).to.be.an("array");
    });
  });

  describe("Get User by ID", () => {
    before(async () => {
      const { expect } = await import("chai");

      expect(health_ok).equal(true);
      expect(USER_ID).to.not.equal(null);
      expect(mongoose.Types.ObjectId.isValid(USER_ID));
    });

    it("should return a 200 status code response", async () => {
      const { expect } = await import("chai");

      const response = await request(app)
        .get("/api/user/getUserById")
        .query({ id: USER_ID })
        .set({
          token: global.SUPER_ADMIN_TOKEN,
        })
        .send();

      expect(response.status).equal(200);
      expect(response.body.data).to.be.an("object").that.is.not.an("array");
    });
  });

  describe("Search Users", () => {
    before(async () => {
      const { expect } = await import("chai");

      expect(health_ok).equal(true);
    });

    it("should return a 200 status code response", async () => {
      const { expect } = await import("chai");

      const response = await request(app)
        .get("/api/user/searchUser")
        .query({ search: "admin", page: 1, limit: 10 })
        .set({
          token: global.SUPER_ADMIN_TOKEN,
        })
        .send();

      expect(response.status).equal(200);
      expect(response.body.data).to.be.an("array");
    });
  });

  describe("Update User", () => {
    before(async () => {
      const { expect } = await import("chai");

      expect(health_ok).equal(true);
      expect(USER_ID).to.not.equal(null);
      expect(mongoose.Types.ObjectId.isValid(USER_ID));
    });

    it("should return a 200 status code response", async () => {
      const { expect } = await import("chai");

      const response = await request(app)
        .put("/api/user/updateUser")
        .set({
          token: global.SUPER_ADMIN_TOKEN,
        })
        .send({
          id: USER_ID,
          role: "superadmin",
        });

      expect(response.status).equal(200);
      expect(response.body.data.role).equal("superadmin");
      expect(response.body.message).equal("User updated successfully");
    });
  });

  describe("Delete User", () => {
    before(async () => {
      const { expect } = await import("chai");

      expect(health_ok).equal(true);
      expect(USER_ID).to.not.equal(null);
      expect(mongoose.Types.ObjectId.isValid(USER_ID));
    });

    it("should return a 200 status code response", async () => {
      const { expect } = await import("chai");

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
});

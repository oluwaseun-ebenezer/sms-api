const request = require("supertest");
const { faker } = require("@faker-js/faker");
const app = require("../app");
const generate = require("./utils/generate");
const { default: mongoose } = require("mongoose");

let health_ok = false;
let SCHOOL_ID = null;

describe("School module", () => {
  before(async () => {
    const { expect } = await import("chai");

    expect(global.SUPER_ADMIN_TOKEN).to.not.equal(undefined);
  });

  describe("Health check", () => {
    it("should return a 200 status code response", async () => {
      const { expect } = await import("chai");

      const response = await request(app)
        .head("/api/school/health")
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

  describe("Create a School", () => {
    before(async () => {
      const { expect } = await import("chai");

      expect(health_ok).equal(true);
    });

    it("should return a 201 status code response", async () => {
      const { expect } = await import("chai");

      const response = await request(app)
        .post("/api/school/createSchool")
        .set({
          token: global.SUPER_ADMIN_TOKEN,
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

      expect(response.status).equal(201);
      expect(response.body.message).equal("School created successfully");

      SCHOOL_ID = response.body.data._id;
    });
  });

  describe("Get All Schools", () => {
    before(async () => {
      const { expect } = await import("chai");

      expect(health_ok).equal(true);
    });

    it("should return a 200 status code response", async () => {
      const { expect } = await import("chai");

      const response = await request(app)
        .get("/api/school/getSchools")
        .query({ page: 1, limit: 10 })
        .set({
          token: global.SUPER_ADMIN_TOKEN,
        })
        .send();

      expect(response.status).equal(200);
      expect(response.body.data).to.be.an("array");
    });
  });

  describe("Get School by ID", () => {
    before(async () => {
      const { expect } = await import("chai");

      expect(health_ok).equal(true);
      expect(SCHOOL_ID).to.not.equal(null);
      expect(mongoose.Types.ObjectId.isValid(SCHOOL_ID));
    });

    it("should return a 200 status code response", async () => {
      const { expect } = await import("chai");

      const response = await request(app)
        .get("/api/school/getSchoolById")
        .query({ id: SCHOOL_ID })
        .set({
          token: global.SUPER_ADMIN_TOKEN,
        })
        .send();

      expect(response.status).equal(200);
      expect(response.body.data).to.be.an("object").that.is.not.an("array");
    });
  });

  describe("Search Schools", () => {
    before(async () => {
      const { expect } = await import("chai");

      expect(health_ok).equal(true);
    });

    it("should return a 200 status code response", async () => {
      const { expect } = await import("chai");

      const response = await request(app)
        .get("/api/school/searchSchool")
        .query({ search: "high", page: 1, limit: 10 })
        .set({
          token: global.SUPER_ADMIN_TOKEN,
        })
        .send();

      expect(response.status).equal(200);
      expect(response.body.data).to.be.an("array");
    });
  });

  describe("Update School", () => {
    before(async () => {
      const { expect } = await import("chai");

      expect(health_ok).equal(true);
      expect(SCHOOL_ID).to.not.equal(null);
      expect(mongoose.Types.ObjectId.isValid(SCHOOL_ID));
    });

    it("should return a 200 status code response", async () => {
      const { expect } = await import("chai");

      const response = await request(app)
        .put("/api/school/updateSchool")
        .set({
          token: global.SUPER_ADMIN_TOKEN,
        })
        .send({
          id: SCHOOL_ID,
          type: "private",
        });

      expect(response.status).equal(200);
      expect(response.body.data.type).equal("private");
      expect(response.body.message).equal("School updated successfully");
    });
  });

  describe("Delete School", () => {
    before(async () => {
      const { expect } = await import("chai");

      expect(health_ok).equal(true);
      expect(SCHOOL_ID).to.not.equal(null);
      expect(mongoose.Types.ObjectId.isValid(SCHOOL_ID));
    });

    it("should return a 200 status code response", async () => {
      const { expect } = await import("chai");

      const response = await request(app)
        .delete("/api/school/deleteSchool")
        .query({ id: SCHOOL_ID })
        .set({
          token: global.SUPER_ADMIN_TOKEN,
        })
        .send();

      expect(response.status).equal(200);
      expect(response.body.message).equal("School deleted successfully");
    });
  });
});

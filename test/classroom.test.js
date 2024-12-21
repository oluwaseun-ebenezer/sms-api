const request = require("supertest");
const { faker } = require("@faker-js/faker");
const app = require("../app");
const generate = require("./utils/generate");
const { default: mongoose } = require("mongoose");

let health_ok = false;
let CLASSROOM_ID = null;
let SCHOOL_ID = new mongoose.Types.ObjectId().toString();

describe("Classroom module", () => {
  before(async () => {
    const { expect } = await import("chai");

    expect(global.SUPER_ADMIN_TOKEN).to.not.equal(undefined);
  });

  describe("Health check", () => {
    it("should return a 200 status code response", async () => {
      const { expect } = await import("chai");

      const response = await request(app)
        .head("/api/classroom/health")
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

  describe("Create a Classroom", () => {
    before(async () => {
      const { expect } = await import("chai");

      expect(health_ok).equal(true);
    });

    it("should return a 201 status code response", async () => {
      const { expect } = await import("chai");

      const response = await request(app)
        .post("/api/classroom/createClassroom")
        .set({
          token: global.SUPER_ADMIN_TOKEN,
        })
        .send({
          name: generate("name", () => faker.company.name()),
          schoolId: SCHOOL_ID,
          capacity: generate("capacity", () => faker.number.int(100)),
          resources: [],
        });

      expect(response.status).equal(201);
      expect(response.body.message).equal("Classroom created successfully");

      CLASSROOM_ID = response.body.data._id;
    });
  });

  describe("Get All Classrooms", () => {
    before(async () => {
      const { expect } = await import("chai");

      expect(health_ok).equal(true);
    });

    it("should return a 200 status code response", async () => {
      const { expect } = await import("chai");

      const response = await request(app)
        .get("/api/classroom/getClassrooms")
        .query({ page: 1, limit: 10 })
        .set({
          token: global.SUPER_ADMIN_TOKEN,
        })
        .send();

      expect(response.status).equal(200);
      expect(response.body.data).to.be.an("array");
    });
  });

  describe("Get Classroom by ID", () => {
    before(async () => {
      const { expect } = await import("chai");

      expect(health_ok).equal(true);
      expect(CLASSROOM_ID).to.not.equal(null);
      expect(mongoose.Types.ObjectId.isValid(CLASSROOM_ID));
    });

    it("should return a 200 status code response", async () => {
      const { expect } = await import("chai");

      const response = await request(app)
        .get("/api/classroom/getClassroomById")
        .query({ id: CLASSROOM_ID })
        .set({
          token: global.SUPER_ADMIN_TOKEN,
        })
        .send();

      expect(response.status).equal(200);
      expect(response.body.data).to.be.an("object").that.is.not.an("array");
    });
  });

  describe("Get Classrooms by School ID", () => {
    before(async () => {
      const { expect } = await import("chai");

      expect(health_ok).equal(true);
      expect(SCHOOL_ID).to.not.equal(null);
      expect(mongoose.Types.ObjectId.isValid(SCHOOL_ID));
    });

    it("should return a 200 status code response", async () => {
      const { expect } = await import("chai");

      const response = await request(app)
        .get("/api/classroom/getClassroomsBySchoolId")
        .query({ school: SCHOOL_ID })
        .set({
          token: global.SUPER_ADMIN_TOKEN,
        })
        .send();

      expect(response.status).equal(200);
      expect(response.body.data).to.be.an("array");
    });
  });

  describe("Search Classrooms", () => {
    before(async () => {
      const { expect } = await import("chai");

      expect(health_ok).equal(true);
    });

    it("should return a 200 status code response", async () => {
      const { expect } = await import("chai");

      const response = await request(app)
        .get("/api/classroom/searchClassroom")
        .query({ search: "admin", page: 1, limit: 10 })
        .set({
          token: global.SUPER_ADMIN_TOKEN,
        })
        .send();

      expect(response.status).equal(200);
      expect(response.body.data).to.be.an("array");
    });
  });

  describe("Update Classroom", () => {
    before(async () => {
      const { expect } = await import("chai");

      expect(health_ok).equal(true);
      expect(CLASSROOM_ID).to.not.equal(null);
      expect(mongoose.Types.ObjectId.isValid(CLASSROOM_ID));
    });

    it("should return a 200 status code response", async () => {
      const { expect } = await import("chai");

      const response = await request(app)
        .put("/api/classroom/updateClassroom")
        .set({
          token: global.SUPER_ADMIN_TOKEN,
        })
        .send({
          id: CLASSROOM_ID,
          capacity: 100,
        });

      expect(response.status).equal(200);
      expect(response.body.data.capacity).equal(100);
      expect(response.body.message).equal("Classroom updated successfully");
    });
  });

  describe("Delete Classroom", () => {
    before(async () => {
      const { expect } = await import("chai");

      expect(health_ok).equal(true);
      expect(CLASSROOM_ID).to.not.equal(null);
      expect(mongoose.Types.ObjectId.isValid(CLASSROOM_ID));
    });

    it("should return a 200 status code response", async () => {
      const { expect } = await import("chai");

      const response = await request(app)
        .delete("/api/classroom/deleteClassroom")
        .query({ id: CLASSROOM_ID })
        .set({
          token: global.SUPER_ADMIN_TOKEN,
        })
        .send();

      expect(response.status).equal(200);
      expect(response.body.message).equal("Classroom deleted successfully");
    });
  });
});

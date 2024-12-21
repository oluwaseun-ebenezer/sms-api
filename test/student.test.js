const request = require("supertest");
const { faker } = require("@faker-js/faker");
const app = require("../app");
const generate = require("./utils/generate");
const { default: mongoose } = require("mongoose");

let health_ok = false;
let STUDENT_ID = null;
let CLASSROOM_ID = new mongoose.Types.ObjectId().toString();
let SCHOOL_ID = new mongoose.Types.ObjectId().toString();

describe("Student module", () => {
  before(async () => {
    const { expect } = await import("chai");

    expect(global.SUPER_ADMIN_TOKEN).to.not.equal(undefined);
  });

  describe("Health check", () => {
    it("should return a 200 status code response", async () => {
      const { expect } = await import("chai");

      const response = await request(app)
        .head("/api/student/health")
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

  describe("Create a Student", () => {
    before(async () => {
      const { expect } = await import("chai");

      expect(health_ok).equal(true);
    });

    it("should return a 201 status code response", async () => {
      const { expect } = await import("chai");

      const response = await request(app)
        .post("/api/student/createStudent")
        .set({
          token: global.SUPER_ADMIN_TOKEN,
        })
        .send({
          firstName: generate("firstName", () => faker.person.firstName()),
          lastName: generate("lastName", () => faker.person.lastName()),
          classroomId: CLASSROOM_ID,
          schoolId: SCHOOL_ID,
          dateOfBirth: generate(
            "dateOfBirth",
            () => faker.date.past(40, "2000-01-01").toISOString().split("T")[0]
          ),
        });

      expect(response.status).equal(201);
      expect(response.body.message).equal("Student created successfully");

      STUDENT_ID = response.body.data._id;
    });
  });

  describe("Get All Students", () => {
    before(async () => {
      const { expect } = await import("chai");

      expect(health_ok).equal(true);
    });

    it("should return a 200 status code response", async () => {
      const { expect } = await import("chai");

      const response = await request(app)
        .get("/api/student/getStudents")
        .query({ page: 1, limit: 10 })
        .set({
          token: global.SUPER_ADMIN_TOKEN,
        })
        .send();

      expect(response.status).equal(200);
      expect(response.body.data).to.be.an("array");
    });
  });

  describe("Get Student by ID", () => {
    before(async () => {
      const { expect } = await import("chai");

      expect(health_ok).equal(true);
      expect(STUDENT_ID).to.not.equal(null);
      expect(mongoose.Types.ObjectId.isValid(STUDENT_ID));
    });

    it("should return a 200 status code response", async () => {
      const { expect } = await import("chai");

      const response = await request(app)
        .get("/api/student/getStudentById")
        .query({ id: STUDENT_ID })
        .set({
          token: global.SUPER_ADMIN_TOKEN,
        })
        .send();

      expect(response.status).equal(200);
      expect(response.body.data).to.be.an("object").that.is.not.an("array");
    });
  });

  describe("Get Students by School ID", () => {
    before(async () => {
      const { expect } = await import("chai");

      expect(health_ok).equal(true);
      expect(SCHOOL_ID).to.not.equal(null);
      expect(mongoose.Types.ObjectId.isValid(SCHOOL_ID));
    });

    it("should return a 200 status code response", async () => {
      const { expect } = await import("chai");

      const response = await request(app)
        .get("/api/student/getStudentsBySchoolId")
        .query({ school: SCHOOL_ID })
        .set({
          token: global.SUPER_ADMIN_TOKEN,
        })
        .send();

      expect(response.status).equal(200);
      expect(response.body.data).to.be.an("array");
    });
  });

  describe("Get Students by classroom ID", () => {
    before(async () => {
      const { expect } = await import("chai");

      expect(health_ok).equal(true);
      expect(CLASSROOM_ID).to.not.equal(null);
      expect(mongoose.Types.ObjectId.isValid(CLASSROOM_ID));
    });

    it("should return a 200 status code response", async () => {
      const { expect } = await import("chai");

      const response = await request(app)
        .get("/api/student/getStudentsByClassroomId")
        .query({ classroom: CLASSROOM_ID })
        .set({
          token: global.SUPER_ADMIN_TOKEN,
        })
        .send();

      expect(response.status).equal(200);
      expect(response.body.data).to.be.an("array");
    });
  });

  describe("Search Students", () => {
    before(async () => {
      const { expect } = await import("chai");

      expect(health_ok).equal(true);
    });

    it("should return a 200 status code response", async () => {
      const { expect } = await import("chai");

      const response = await request(app)
        .get("/api/student/searchStudent")
        .query({ search: "admin", page: 1, limit: 10 })
        .set({
          token: global.SUPER_ADMIN_TOKEN,
        })
        .send();

      expect(response.status).equal(200);
      expect(response.body.data).to.be.an("array");
    });
  });

  describe("Update Student", () => {
    before(async () => {
      const { expect } = await import("chai");

      expect(health_ok).equal(true);
      expect(STUDENT_ID).to.not.equal(null);
      expect(mongoose.Types.ObjectId.isValid(STUDENT_ID));
    });

    it("should return a 200 status code response", async () => {
      const { expect } = await import("chai");

      const response = await request(app)
        .put("/api/student/updateStudent")
        .set({
          token: global.SUPER_ADMIN_TOKEN,
        })
        .send({
          id: STUDENT_ID,
          dateOfBirth: "2015-06-06",
        });

      expect(response.status).equal(200);
      expect(response.body.data.dateOfBirth).equal("2015-06-06T00:00:00.000Z");
      expect(response.body.message).equal("Student updated successfully");
    });
  });

  describe("Delete Student", () => {
    before(async () => {
      const { expect } = await import("chai");

      expect(health_ok).equal(true);
      expect(STUDENT_ID).to.not.equal(null);
      expect(mongoose.Types.ObjectId.isValid(STUDENT_ID));
    });

    it("should return a 200 status code response", async () => {
      const { expect } = await import("chai");

      const response = await request(app)
        .delete("/api/student/deleteStudent")
        .query({ id: STUDENT_ID })
        .set({
          token: global.SUPER_ADMIN_TOKEN,
        })
        .send();

      expect(response.status).equal(200);
      expect(response.body.message).equal("Student deleted successfully");
    });
  });
});

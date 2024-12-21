const request = require("supertest");
const { faker } = require("@faker-js/faker");
const app = require("../app");
const generate = require("./utils/generate");
const { default: mongoose } = require("mongoose");

let USER_TOKEN = null;

describe("Aunthorization check", () => {
  describe("Create user without authentication", () => {
    it("should return a 401 status code response", async () => {
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

      expect(response.status).equal(401);
    });
  });

  describe("Get users without authentication", () => {
    it("should return a 401 status code response", async () => {
      const { expect } = await import("chai");

      const response = await request(app)
        .get("/api/user/getUsers")
        .set({
          token: USER_TOKEN,
        })
        .send();

      expect(response.status).equal(401);
    });
  });

  describe("Create school without authentication", () => {
    it("should return a 401 status code response", async () => {
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

      expect(response.status).equal(401);
    });
  });

  describe("Get schools without authentication", () => {
    it("should return a 401 status code response", async () => {
      const { expect } = await import("chai");

      const response = await request(app)
        .get("/api/school/getSchools")
        .set({
          token: USER_TOKEN,
        })
        .send();

      expect(response.status).equal(401);
    });
  });

  describe("Create classroom without authentication", () => {
    it("should return a 401 status code response", async () => {
      const { expect } = await import("chai");

      const response = await request(app)
        .post("/api/classroom/createClassroom")
        .set({
          token: USER_TOKEN,
        })
        .send({
          name: generate("name", () => faker.company.name()),
          schoolId: new mongoose.Types.ObjectId().toString(),
          capacity: generate("capacity", () => faker.number.int(100)),
          resources: [],
        });

      expect(response.status).equal(401);
    });
  });

  describe("Get classrooms without authentication", () => {
    it("should return a 401 status code response", async () => {
      const { expect } = await import("chai");

      const response = await request(app)
        .get("/api/classroom/getClassrooms")
        .set({
          token: USER_TOKEN,
        })
        .send();

      expect(response.status).equal(401);
    });
  });

  describe("Create student without authentication", () => {
    it("should return a 401 status code response", async () => {
      const { expect } = await import("chai");

      const response = await request(app)
        .post("/api/student/createStudent")
        .set({
          token: USER_TOKEN,
        })
        .send({
          firstName: generate("firstName", () => faker.person.firstName()),
          lastName: generate("lastName", () => faker.person.lastName()),
          classroomId: new mongoose.Types.ObjectId().toString(),
          schoolId: new mongoose.Types.ObjectId().toString(),
          dateOfBirth: generate(
            "dateOfBirth",
            () => faker.date.past(40, "2000-01-01").toISOString().split("T")[0]
          ),
        });

      expect(response.status).equal(401);
    });
  });

  describe("Get students without authentication", () => {
    it("should return a 401 status code response", async () => {
      const { expect } = await import("chai");

      const response = await request(app)
        .get("/api/student/getStudents")
        .set({
          token: USER_TOKEN,
        })
        .send();

      expect(response.status).equal(401);
    });
  });
});

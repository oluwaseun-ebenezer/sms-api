const request = require("supertest");
const { faker } = require("@faker-js/faker");
const app = require("../app");
const generate = require("./utils/generate");
const { default: mongoose } = require("mongoose");

let USER_ID = null;
let USER_TOKEN = null;
const SCHOOL_ID = new mongoose.Types.ObjectId();

const USER_EMAIL = generate("email", () => faker.internet.email());
const USER_PASSWORD = generate("password", () =>
  faker.internet.password(10, true)
);

/**
 * Ensure that users (`admins` that are not superadmin) are
 * limited to interact with the assigned school closely
 */
describe("School specific access", () => {
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
        schoolId: SCHOOL_ID,
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

  describe("Create classroom in the associated school", () => {
    it("should return a 201 status code response", async () => {
      const { expect } = await import("chai");

      const response = await request(app)
        .post("/api/classroom/createClassroom")
        .set({
          token: USER_TOKEN,
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

  describe("Create classroom in another school", () => {
    it("should return a 403 status code response", async () => {
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

      expect(response.status).equal(403);
    });
  });

  describe("Update classroom to another school", () => {
    it("should return a 200 status code response", async () => {
      const { expect } = await import("chai");

      const response = await request(app)
        .put("/api/classroom/updateClassroom")
        .set({
          token: USER_TOKEN,
        })
        .send({
          schoolId: new mongoose.Types.ObjectId().toString(),
        });

      expect(response.status).equal(403);
    });
  });

  describe("Create student in the associated school", () => {
    it("should return a 201 status code response", async () => {
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

  describe("Create student in another school", () => {
    it("should return a 201 status code response", async () => {
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

      expect(response.status).equal(403);
    });
  });

  describe("Update student to another school", () => {
    it("should return a 200 status code response", async () => {
      const { expect } = await import("chai");

      const response = await request(app)
        .put("/api/student/updateStudent")
        .set({
          token: USER_TOKEN,
        })
        .send({
          schoolId: new mongoose.Types.ObjectId().toString(),
        });

      expect(response.status).equal(403);
    });
  });

  after(async () => {
    const { expect } = await import("chai");

    const classroom_response = await request(app)
      .delete("/api/classroom/deleteClassroom")
      .query({ id: CLASSROOM_ID })
      .set({
        token: USER_TOKEN,
      })
      .send();

    expect(classroom_response.status).equal(200);
    expect(classroom_response.body.message).equal(
      "Classroom deleted successfully"
    );

    const student_response = await request(app)
      .delete("/api/student/deleteStudent")
      .query({ id: STUDENT_ID })
      .set({
        token: USER_TOKEN,
      })
      .send();

    expect(student_response.status).equal(200);
    expect(student_response.body.message).equal("Student deleted successfully");

    expect(USER_ID).to.not.equal(null);
    expect(mongoose.Types.ObjectId.isValid(USER_ID));

    const user_response = await request(app)
      .delete("/api/user/deleteUser")
      .query({ id: USER_ID })
      .set({
        token: global.SUPER_ADMIN_TOKEN,
      })
      .send();

    expect(user_response.status).equal(200);
    expect(user_response.body.message).equal("User deleted successfully");
  });
});

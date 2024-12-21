const request = require("supertest");
const app = require("../app");

describe("Generate Super admin token", () => {
  it("should return a 200 status code response", async () => {
    // Generate user token to run tests

    const { expect } = await import("chai");

    const response = await request(app)
      .post("/api/user/auth")
      .set({
        Authorization: `Basic ${Buffer.from(
          `${global.SUPER_ADMIN_EMAIL}:${global.SUPER_ADMIN_PASSWORD}`
        ).toString("base64")}`,
      })
      .send();

    expect(response.status).equal(200);

    global.SUPER_ADMIN_TOKEN = response.body.data;
    expect(global.SUPER_ADMIN_TOKEN).to.not.equal(null);
  });
});

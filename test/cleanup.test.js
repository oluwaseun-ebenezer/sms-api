const request = require("supertest");
const app = require("../app");
const { default: mongoose } = require("mongoose");

describe("Clean Seeds", () => {
  before(async () => {
    const { expect } = await import("chai");

    expect(global.SUPER_ADMIN_ID).to.not.equal(null);
    expect(mongoose.Types.ObjectId.isValid(global.SUPER_ADMIN_ID));
  });

  it("should return a 200 status code response", async () => {
    const { expect } = await import("chai");

    const response = await request(app)
      .delete("/api/user/deleteUser")
      .query({ id: global.SUPER_ADMIN_ID })
      .set({
        token: global.SUPER_ADMIN_TOKEN,
      })
      .send();

    expect(response.status).equal(200);
    expect(response.body.message).equal("User deleted successfully");
  });
});

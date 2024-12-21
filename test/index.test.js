describe("App modules test", () => {
  /**
   * It is assummed that the default superadmin has been
   * seeded into the database as passed thorugh the
   * environment variables
   */

  require("./seed.test");
  require("./token.test");
  require("./user.test");
  require("./school.test");
  require("./classroom.test");
  require("./student.test");
  require("./unauthorized.test");
  require("./forbidden.test");
  require("./schoolSpecific.test");

  after(() => {
    require("./cleanup.test");
  });
});

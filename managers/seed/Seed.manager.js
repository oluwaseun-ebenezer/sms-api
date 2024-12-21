module.exports = class SeedManager {
  constructor({ bcrypt, config, mongomodels, utils, validators }) {
    this.bcrypt = bcrypt;
    this.config = config;
    this.mongomodels = mongomodels;
    this.utils = utils;
    this.validators = validators;

    this.httpExposed = ["createDefaultSuperAdmin", "head=health"];
  }

  // Create default super admin - where all operation starts from
  async createDefaultSuperAdmin({ username, email, role, password }) {
    try {
      let result = await this.validators.seed.createDefaultSuperAdmin({
        username: username || this.config.dotEnv.SUPER_ADMIN_USERNAME,
        email: email || this.config.dotEnv.SUPER_ADMIN_EMAIL,
        role: role || "superadmin",
        password: password || this.config.dotEnv.SUPER_ADMIN_PASSWORD,
      });
      if (result) return { errors: result };

      const defaultSuperAdmin = new this.mongomodels.user({
        username: username || this.config.dotEnv.SUPER_ADMIN_USERNAME,
        email: email || this.config.dotEnv.SUPER_ADMIN_EMAIL,
        role: role || "superadmin",
        password: password
          ? await this.bcrypt.hash(password, 10)
          : await this.bcrypt.hash(this.config.dotEnv.SUPER_ADMIN_PASSWORD, 10),
      });

      await defaultSuperAdmin.save();

      defaultSuperAdmin.password = "***";

      // Default superadmin seeded successfully
      return {
        data: defaultSuperAdmin,
        message: "Default superadmin seeded successfully",
        code: 201,
      };
    } catch (error) {
      console.error(error);

      return {
        error:
          this.utils.extractMongooseErrors(error) ??
          "Error seeding default super admin",
      };
    }
  }

  async health({}) {
    return;
  }
};

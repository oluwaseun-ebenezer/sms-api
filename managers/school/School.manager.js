module.exports = class SchoolManager {
  constructor({ config, mongomodels, utils, validators }) {
    this.config = config;
    this.mongomodels = mongomodels;
    this.utils = utils;
    this.validators = validators;

    this.httpExposed = [
      "createSchool",
      "get=getSchools",
      "get=getSchoolById",
      "get=searchSchool",
      "put=updateSchool",
      "delete=deleteSchool",
      "head=health",
    ];
  }

  // Creates a new school (Superadmin only)
  async createSchool({
    __longToken,
    __superAdmin,
    name,
    address,
    phone,
    email,
    website,
    type,
  }) {
    try {
      let result = await this.validators.school.createSchool({
        name,
        address,
        phone,
        email,
        website,
        type,
      });
      if (result) return { errors: result };

      const newSchool = new this.mongomodels.school({
        name,
        address,
        phone,
        email,
        website,
        type,
      });

      await newSchool.save();

      // School created successfully
      return {
        data: newSchool,
        message: "School created successfully",
        code: 201,
      };
    } catch (error) {
      console.error(error);

      return {
        error:
          this.utils.extractMongooseErrors(error) ?? "Error creating school",
      };
    }
  }

  // Fetches a list of schools (Superadmin only)
  async getSchools({ __longToken, __superAdmin, __query }) {
    try {
      const { page, limit } = this.utils.getPaginationQuery(
        __query.page,
        __query.limit
      );

      let result = await this.validators.school.getSchools({
        page,
        limit,
      });
      if (result) return { errors: result };

      const schools = await this.mongomodels.school
        .find()
        .skip((page - 1) * limit)
        .limit(limit);

      return {
        data: schools,
      };
    } catch (error) {
      console.error(error);

      return {
        error:
          this.utils.extractMongooseErrors(error) ?? "Error fetching schools",
      };
    }
  }

  // Fetches a school by ID (Superadmin only)
  async getSchoolById({ __longToken, __superAdmin, __query }) {
    try {
      const id = __query.id;

      let result = await this.validators.school.getSchoolById({
        id,
      });
      if (result) return { errors: result };

      const school = await this.mongomodels.school.findOne({ _id: id });

      return {
        data: school,
        code: school ? 200 : 404,
        ...(!school ? { error: "School does not exist" } : {}),
      };
    } catch (error) {
      console.error(error);

      return {
        error:
          this.utils.extractMongooseErrors(error) ?? "Error fetching school",
      };
    }
  }

  // Fetches a list of schools that matches a search text (Superadmin only)
  async searchSchool({ __longToken, __superAdmin, __query }) {
    try {
      const search = __query.search;
      const { page, limit } = this.utils.getPaginationQuery(
        __query.page,
        __query.limit
      );

      let result = await this.validators.school.searchSchool({
        search,
        page,
        limit,
      });
      if (result) return { errors: result };

      const schools = await this.mongomodels.school
        .find({
          name: { $regex: new RegExp(search, "i") },
        })
        .skip((page - 1) * limit)
        .limit(limit);

      return {
        data: schools,
      };
    } catch (error) {
      console.error(error);

      return {
        error:
          this.utils.extractMongooseErrors(error) ?? "Error fetching schools",
      };
    }
  }

  // Updates school details (Superadmin only)
  async updateSchool({
    __longToken,
    __superAdmin,
    id,
    name,
    address,
    phone,
    email,
    website,
    type,
  }) {
    try {
      let result = await this.validators.school.updateSchool({
        id,
        name,
        address,
        phone,
        email,
        website,
        type,
      });
      if (result) return { errors: result };

      const updatedSchool = await this.mongomodels.school.findByIdAndUpdate(
        id,
        {
          name,
          address,
          phone,
          email,
          website,
          type,
        },
        { new: true }
      );

      // School updated successfully
      return {
        data: updatedSchool ?? {},
        code: updatedSchool ? 200 : 404,
        ...(updatedSchool ? { message: "School updated successfully" } : {}),
        ...(!updatedSchool ? { error: "School does not exist" } : {}),
      };
    } catch (error) {
      console.error(error);

      return {
        error:
          this.utils.extractMongooseErrors(error) ?? "Error updating school",
      };
    }
  }

  // Deletes a school (Superadmin only)
  async deleteSchool({ __longToken, __superAdmin, __query }) {
    try {
      const id = __query.id;

      let result = await this.validators.school.deleteSchool({
        id,
      });
      if (result) return { errors: result };

      const item = await this.mongomodels.school.findByIdAndDelete(id);

      // School deleted successfully
      return {
        data: {},
        code: item ? 200 : 404,
        ...(item ? { message: "School deleted successfully" } : {}),
        ...(!item ? { error: "School does not exist" } : {}),
      };
    } catch (error) {
      console.error(error);

      return {
        error:
          this.utils.extractMongooseErrors(error) ?? "Error deleting school",
      };
    }
  }

  async health({ __longToken, __superAdmin }) {
    return;
  }
};

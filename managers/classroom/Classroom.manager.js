module.exports = class ClassroomManager {
  constructor({ config, mongomodels, utils, validators }) {
    this.config = config;
    this.mongomodels = mongomodels;
    this.utils = utils;
    this.validators = validators;

    this.httpExposed = [
      "createClassroom",
      "get=getClassrooms",
      "get=getClassroomById",
      "get=getClassroomsBySchoolId",
      "get=searchClassroom",
      "put=updateClassroom",
      "delete=deleteClassroom",
      "head=health",
    ];
  }

  // Creates a new classroom
  async createClassroom({
    __longToken,
    __admin,
    __school,
    name,
    capacity,
    schoolId,
    resources,
  }) {
    try {
      let result = await this.validators.classroom.createClassroom({
        name,
        capacity,
        schoolId,
        resources,
      });
      if (result) return { errors: result };

      const newClassroom = new this.mongomodels.classroom({
        schoolId,
        name,
        capacity,
        resources,
      });

      await newClassroom.save();

      // Classroom created successfully
      return {
        data: newClassroom,
        message: "Classroom created successfully",
        code: 201,
      };
    } catch (error) {
      console.error(error);

      return {
        error:
          this.utils.extractMongooseErrors(error) ?? "Error creating classroom",
      };
    }
  }

  // Fetches a list of classrooms
  async getClassrooms({ __longToken, __admin, __query }) {
    try {
      const { page, limit } = this.utils.getPaginationQuery(
        __query.page,
        __query.limit
      );

      let result = await this.validators.classroom.getClassrooms({
        page,
        limit,
      });
      if (result) return { errors: result };

      const classrooms = await this.mongomodels.classroom
        .find()
        .skip((page - 1) * limit)
        .limit(limit);

      return {
        data: classrooms,
      };
    } catch (error) {
      console.error(error);

      return {
        error:
          this.utils.extractMongooseErrors(error) ??
          "Error fetching classrooms",
      };
    }
  }

  // Fetches a classroom by ID
  async getClassroomById({ __longToken, __admin, __query }) {
    try {
      const id = __query.id;

      let result = await this.validators.classroom.getClassroomById({
        id,
      });
      if (result) return { errors: result };

      const classroom = await this.mongomodels.classroom.findOne({ _id: id });

      return {
        data: classroom,
        code: classroom ? 200 : 404,
        ...(!classroom ? { error: "Classroom does not exist" } : {}),
      };
    } catch (error) {
      console.error(error);

      return {
        error:
          this.utils.extractMongooseErrors(error) ?? "Error fetching classroom",
      };
    }
  }

  // Fetches classrooms by school ID
  async getClassroomsBySchoolId({ __longToken, __admin, __school, __query }) {
    try {
      const school = __query.school;
      const { page, limit } = this.utils.getPaginationQuery(
        __query.page,
        __query.limit
      );

      let result = await this.validators.classroom.getClassroomsBySchoolId({
        school,
        page,
        limit,
      });
      if (result) return { errors: result };

      const classrooms = await this.mongomodels.classroom
        .find({
          schoolId: school,
        })
        .skip((page - 1) * limit)
        .limit(limit);

      return {
        data: classrooms,
      };
    } catch (error) {
      console.error(error);

      return {
        error:
          this.utils.extractMongooseErrors(error) ??
          "Error fetching classrooms",
      };
    }
  }

  // Fetches a list of classrooms that matches a search text
  async searchClassroom({ __longToken, __superAdmin, __query }) {
    try {
      const search = __query.search;
      const { page, limit } = this.utils.getPaginationQuery(
        __query.page,
        __query.limit
      );

      let result = await this.validators.classroom.searchClassroom({
        search,
        page,
        limit,
      });
      if (result) return { errors: result };

      const classrooms = await this.mongomodels.classroom
        .find({
          name: { $regex: new RegExp(search, "i") },
        })
        .skip((page - 1) * limit)
        .limit(limit);

      return {
        data: classrooms,
      };
    } catch (error) {
      console.error(error);

      return {
        error:
          this.utils.extractMongooseErrors(error) ??
          "Error fetching classrooms",
      };
    }
  }

  async updateClassroom({
    __longToken,
    __admin,
    __school,
    id,
    name,
    capacity,
    schoolId,
    resources,
  }) {
    try {
      let result = await this.validators.classroom.updateClassroom({
        id,
        name,
        capacity,
        schoolId,
        resources,
      });
      if (result) return { errors: result };

      const updatedClassroom =
        await this.mongomodels.classroom.findByIdAndUpdate(
          id,
          {
            name,
            capacity,
            schoolId,
            resources,
          },
          { new: true }
        );

      // Classroom updated successfully
      return {
        data: updatedClassroom ?? {},
        code: updatedClassroom ? 200 : 404,
        ...(updatedClassroom
          ? { message: "Classroom updated successfully" }
          : {}),
        ...(!updatedClassroom ? { error: "Classroom does not exist" } : {}),
      };
    } catch (error) {
      console.error(error);

      return {
        error:
          this.utils.extractMongooseErrors(error) ?? "Error updating classroom",
      };
    }
  }

  async deleteClassroom({ __longToken, __admin, __query }) {
    try {
      const id = __query.id;

      let result = await this.validators.classroom.deleteClassroom({
        id,
      });
      if (result) return { errors: result };

      const item = await this.mongomodels.classroom.findByIdAndDelete(id);

      // Classroom deleted successfully
      return {
        data: {},
        code: item ? 200 : 404,
        ...(item ? { message: "Classroom deleted successfully" } : {}),
        ...(!item ? { error: "Classroom does not exist" } : {}),
      };
    } catch (error) {
      console.error(error);

      return {
        error:
          this.utils.extractMongooseErrors(error) ?? "Error deleting classroom",
      };
    }
  }

  async health({ __longToken, __admin }) {
    return;
  }
};

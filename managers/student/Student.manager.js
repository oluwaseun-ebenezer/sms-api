module.exports = class StudentManager {
  constructor({ config, mongomodels, utils, validators }) {
    this.config = config;
    this.mongomodels = mongomodels;
    this.utils = utils;
    this.validators = validators;

    this.httpExposed = [
      "createStudent",
      "get=getStudents",
      "get=getStudentById",
      "get=getStudentsBySchoolId",
      "get=getStudentsByClassroomId",
      "get=searchStudent",
      "put=updateStudent",
      "delete=deleteStudent",
      "head=health",
    ];
  }

  // Creates a new student
  async createStudent({
    __longToken,
    __admin,
    __school,
    schoolId,
    classroomId,
    firstName,
    lastName,
    dateOfBirth,
  }) {
    try {
      let result = await this.validators.student.createStudent({
        schoolId,
        classroomId,
        firstName,
        lastName,
        dateOfBirth,
      });
      if (result) return { errors: result };

      const newStudent = new this.mongomodels.student({
        schoolId,
        classroomId,
        firstName,
        lastName,
        dateOfBirth,
      });

      await newStudent.save();

      // Student created successfully
      return {
        data: newStudent,
        message: "Student created successfully",
        code: 201,
      };
    } catch (error) {
      console.error(error);

      return {
        error:
          this.utils.extractMongooseErrors(error) ?? "Error creating student",
      };
    }
  }

  // Fetches a list of students
  async getStudents({ __longToken, __admin, __query }) {
    try {
      const { page, limit } = this.utils.getPaginationQuery(
        __query.page,
        __query.limit
      );

      let result = await this.validators.student.getStudents({
        page,
        limit,
      });
      if (result) return { errors: result };

      const students = await this.mongomodels.student
        .find()
        .skip((page - 1) * limit)
        .limit(limit);

      return {
        data: students,
      };
    } catch (error) {
      console.error(error);

      return {
        error:
          this.utils.extractMongooseErrors(error) ?? "Error fetching students",
      };
    }
  }

  // Fetches a student by ID
  async getStudentById({ __longToken, __admin, __query }) {
    try {
      const id = __query.id;

      let result = await this.validators.student.getStudentById({
        id,
      });
      if (result) return { errors: result };

      const student = await this.mongomodels.student.findOne({ _id: id });

      return {
        data: student,
        code: student ? 200 : 404,
        ...(!student ? { error: "Student does not exist" } : {}),
      };
    } catch (error) {
      console.error(error);

      return {
        error:
          this.utils.extractMongooseErrors(error) ?? "Error fetching student",
      };
    }
  }

  // Fetches students by school ID
  async getStudentsBySchoolId({ __longToken, __admin, __school, __query }) {
    try {
      const school = __query.school;
      const { page, limit } = this.utils.getPaginationQuery(
        __query.page,
        __query.limit
      );

      let result = await this.validators.student.getStudentsBySchoolId({
        school,
        page,
        limit,
      });
      if (result) return { errors: result };

      const students = await this.mongomodels.student
        .find({
          schoolId: school,
        })
        .skip((page - 1) * limit)
        .limit(limit);

      return {
        data: students,
      };
    } catch (error) {
      console.error(error);

      return {
        error:
          this.utils.extractMongooseErrors(error) ?? "Error fetching students",
      };
    }
  }

  // Fetches students by classroom ID
  async getStudentsByClassroomId({ __longToken, __admin, __query }) {
    try {
      const classroom = __query.classroom;
      const { page, limit } = this.utils.getPaginationQuery(
        __query.page,
        __query.limit
      );

      let result = await this.validators.student.getStudentsByClassroomId({
        classroom,
        page,
        limit,
      });
      if (result) return { errors: result };

      const students = await this.mongomodels.student
        .find({
          classroomId: classroom,
        })
        .skip((page - 1) * limit)
        .limit(limit);

      return {
        data: students,
      };
    } catch (error) {
      console.error(error);

      return {
        error:
          this.utils.extractMongooseErrors(error) ?? "Error fetching students",
      };
    }
  }

  // Fetches a list of students that matches a search text
  async searchStudent({ __longToken, __admin, __query }) {
    try {
      const search = __query.search;
      const { page, limit } = this.utils.getPaginationQuery(
        __query.page,
        __query.limit
      );

      let result = await this.validators.student.searchStudent({
        search,
        page,
        limit,
      });
      if (result) return { errors: result };

      const students = await this.mongomodels.student
        .find({
          $or: [
            { firstName: { $regex: new RegExp(search, "i") } },
            { lastName: { $regex: new RegExp(search, "i") } },
          ],
        })
        .skip((page - 1) * limit)
        .limit(limit);

      return {
        data: students,
      };
    } catch (error) {
      console.error(error);

      return {
        error:
          this.utils.extractMongooseErrors(error) ?? "Error fetching students",
      };
    }
  }

  async updateStudent({
    __longToken,
    __admin,
    __school,
    id,
    schoolId,
    classroomId,
    firstName,
    lastName,
    dateOfBirth,
  }) {
    try {
      let result = await this.validators.student.updateStudent({
        id,
        schoolId,
        classroomId,
        firstName,
        lastName,
        dateOfBirth,
      });
      if (result) return { errors: result };

      const updatedStudent = await this.mongomodels.student.findByIdAndUpdate(
        id,
        {
          schoolId,
          classroomId,
          firstName,
          lastName,
          dateOfBirth,
        },
        { new: true }
      );

      // Student updated successfully
      return {
        data: updatedStudent ?? {},
        code: updatedStudent ? 200 : 404,
        ...(updatedStudent ? { message: "Student updated successfully" } : {}),
        ...(!updatedStudent ? { error: "Student does not exist" } : {}),
      };
    } catch (error) {
      console.error(error);

      return {
        error:
          this.utils.extractMongooseErrors(error) ?? "Error updating student",
      };
    }
  }

  async deleteStudent({ __longToken, __admin, __query }) {
    // Had to make use of queries to pass the ID, no way to do delete by params
    try {
      const id = __query.id;

      let result = await this.validators.student.deleteStudent({
        id,
      });
      if (result) return { errors: result };

      const item = await this.mongomodels.student.findByIdAndDelete(id);

      // Student deleted successfully
      return {
        data: {},
        code: item ? 200 : 404,
        ...(item ? { message: "Student deleted successfully" } : {}),
        ...(!item ? { error: "Student does not exist" } : {}),
      };
    } catch (error) {
      console.error(error);

      return {
        error:
          this.utils.extractMongooseErrors(error) ?? "Error deleting student",
      };
    }
  }

  async health({ __longToken, __admin }) {
    return;
  }
};

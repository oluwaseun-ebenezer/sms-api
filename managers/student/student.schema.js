module.exports = {
  createStudent: [
    {
      model: "schoolId",
      required: true,
    },
    {
      model: "classroomId",
      required: true,
    },
    {
      model: "firstName",
      required: true,
    },
    {
      model: "lastName",
      required: true,
    },
    {
      model: "dateOfBirth",
      required: true,
    },
  ],
  getStudents: [
    {
      model: "page",
      required: false,
    },
    {
      model: "limit",
      required: false,
    },
  ],
  getStudentById: [
    {
      model: "id",
      required: true,
    },
  ],
  getStudentsBySchoolId: [
    {
      model: "page",
      required: false,
    },
    {
      model: "limit",
      required: false,
    },
    {
      model: "school",
      required: true,
    },
  ],
  getStudentsByClassroomId: [
    {
      model: "page",
      required: false,
    },
    {
      model: "limit",
      required: false,
    },
    {
      model: "classroom",
      required: true,
    },
  ],
  searchStudent: [
    {
      model: "page",
      required: false,
    },
    {
      model: "limit",
      required: false,
    },
    {
      model: "search",
      required: true,
    },
  ],
  updateStudent: [
    {
      model: "id",
      required: true,
    },
    {
      model: "schoolId",
      required: false,
    },
    {
      model: "classroomId",
      required: false,
    },
    {
      model: "firstName",
      required: false,
    },
    {
      model: "lastName",
      required: false,
    },
    {
      model: "dateOfBirth",
      required: false,
    },
  ],
  deleteStudent: [
    {
      model: "id",
      required: true,
    },
  ],
};

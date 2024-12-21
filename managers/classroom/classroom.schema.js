module.exports = {
  createClassroom: [
    {
      model: "name",
      required: true,
    },
    {
      model: "capacity",
      required: true,
    },
    {
      model: "schoolId",
      required: true,
    },
    {
      model: "resources",
      required: true,
    },
  ],
  getClassrooms: [
    {
      model: "page",
      required: false,
    },
    {
      model: "limit",
      required: false,
    },
  ],
  getClassroomById: [
    {
      model: "id",
      required: true,
    },
  ],
  getClassroomsBySchoolId: [
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
  searchClassroom: [
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
  updateClassroom: [
    {
      model: "id",
      required: true,
    },
    {
      model: "name",
      required: false,
    },
    {
      model: "capacity",
      required: false,
    },
    {
      model: "schoolId",
      required: false,
    },
    {
      model: "resources",
      required: false,
    },
  ],
  deleteClassroom: [
    {
      model: "id",
      required: true,
    },
  ],
};

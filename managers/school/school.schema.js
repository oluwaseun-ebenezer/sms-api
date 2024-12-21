module.exports = {
  createSchool: [
    {
      model: "name",
      required: true,
    },
    {
      model: "address",
      required: true,
    },
    {
      model: "phone",
      required: true,
    },
    {
      model: "email",
      required: true,
    },
    {
      model: "website",
      required: false,
    },
    {
      model: "type",
      required: true,
    },
  ],
  getSchools: [
    {
      model: "page",
      required: false,
    },
    {
      model: "limit",
      required: false,
    },
  ],
  searchSchool: [
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
  getSchoolById: [
    {
      model: "id",
      required: true,
    },
  ],
  updateSchool: [
    {
      model: "id",
      required: true,
    },
    {
      model: "name",
      required: false,
    },
    {
      model: "address",
      required: false,
    },
    {
      model: "phone",
      required: false,
    },
    {
      model: "email",
      required: false,
    },
    {
      model: "website",
      required: false,
    },
    {
      model: "type",
      required: false,
    },
  ],
  deleteSchool: [
    {
      model: "id",
      required: true,
    },
  ],
};

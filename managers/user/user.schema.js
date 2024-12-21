module.exports = {
  createUser: [
    {
      model: "username",
      required: true,
    },
    {
      model: "email",
      required: true,
    },
    {
      model: "role",
      required: true,
    },
    {
      model: "password",
      required: true,
    },
    {
      model: "schoolId",
      required: false,
    },
  ],
  getUsers: [
    {
      model: "page",
      required: false,
    },
    {
      model: "limit",
      required: false,
    },
  ],
  searchUser: [
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
  getUserById: [
    {
      model: "id",
      required: true,
    },
  ],
  updateUser: [
    {
      model: "id",
      required: true,
    },
    {
      model: "username",
      required: false,
    },
    {
      model: "email",
      required: false,
    },
    {
      model: "role",
      required: false,
    },
    {
      model: "password",
      required: false,
    },
    {
      model: "schoolId",
      required: false,
    },
  ],
  deleteUser: [
    {
      model: "id",
      required: true,
    },
  ],
};

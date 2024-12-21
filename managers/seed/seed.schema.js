module.exports = {
  createDefaultSuperAdmin: [
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
  ],
};

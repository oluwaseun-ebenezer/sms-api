// Comprehensive input validations are defined here

module.exports = {
  id: (data) => /^[a-fA-F0-9]{24}$/.test(data),

  username: (data) => {
    if (typeof data !== "string") return false;
    const trimmed = data.trim();
    return (
      trimmed.length >= 3 &&
      trimmed.length <= 20 &&
      /^[a-zA-Z0-9_]+$/.test(trimmed)
    );
  },

  password: (data) =>
    typeof data === "string" && data.length >= 8 && data.length <= 100,

  role: (data) =>
    typeof data === "string" && ["admin", "superadmin"].includes(data.trim()),

  school: (data) => /^[a-fA-F0-9]{24}$/.test(data),

  schoolId: (data) => /^[a-fA-F0-9]{24}$/.test(data),

  classroom: (data) => /^[a-fA-F0-9]{24}$/.test(data),

  classroomId: (data) => /^[a-fA-F0-9]{24}$/.test(data),

  website: (data) => {
    const websitePattern =
      /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,})([\/\w .-]*)*\/?$/;
    return (
      typeof data === "string" &&
      data.length >= 9 &&
      data.length <= 300 &&
      websitePattern.test(data)
    );
  },

  phone: (data) => typeof data === "string" && /^\+?[1-9]\d{1,14}$/.test(data),

  name: (data) =>
    typeof data === "string" && data.length >= 3 && data.length <= 100,

  firstName: (data) =>
    typeof data === "string" && data.length >= 3 && data.length <= 100,

  lastName: (data) =>
    typeof data === "string" && data.length >= 3 && data.length <= 100,

  address: (data) =>
    typeof data === "string" && data.length >= 3 && data.length <= 150,
  type: (data) =>
    typeof data === "string" && data.length >= 6 && data.length <= 7,

  email: (data) =>
    typeof data === "string" &&
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      data
    ),
  page: (data) => typeof data === "number" && data >= 1,

  limit: (data) => typeof data === "number" && data >= 1,

  search: (data) =>
    typeof data === "string" && data.length >= 3 && data.length <= 50,

  capacity: (data) => typeof data === "number" && data >= 1,

  dateOfBirth: (data) => {
    if (typeof data !== "string") return false;

    // check if the date matches the format YYYY-MM-DD
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(data)) return false;

    const date = new Date(data);
    if (isNaN(date.getTime())) return false;

    // check if the date is in the past
    const today = new Date();
    if (date >= today) return false;

    return true;
  },
};

module.exports = class UserManager {
  constructor({ bcrypt, config, mongomodels, managers, utils, validators }) {
    this.bcrypt = bcrypt;
    this.config = config;
    this.mongomodels = mongomodels;
    this.tokenManager = managers.token;
    this.utils = utils;
    this.validators = validators;

    this.httpExposed = [
      "auth",
      "createUser",
      "get=getUsers",
      "get=getUserById",
      "get=searchUser",
      "put=updateUser",
      "delete=deleteUser",
      "head=health",
    ];
  }

  // Creates a new user (Superadmin only)
  async createUser({
    __longToken,
    __superAdmin,
    username,
    email,
    role,
    schoolId,
    password,
  }) {
    try {
      let result = await this.validators.user.createUser({
        username,
        email,
        role,
        schoolId,
        password,
      });
      if (result) return { errors: result };

      const newUser = new this.mongomodels.user({
        username,
        email,
        role,
        schoolId,
        password: await this.bcrypt.hash(password, 10),
      });

      await newUser.save();

      newUser.password = "***";

      // User created successfully
      return {
        data: newUser,
        message: "User created successfully",
        code: 201,
      };
    } catch (error) {
      console.error(error);
      console.error(error.message);

      return {
        error: this.utils.extractMongooseErrors(error) ?? "Error creating user",
      };
    }
  }

  // Fetches a list of users (Superadmin only)
  async getUsers({ __longToken, __superAdmin, __query }) {
    try {
      const { page, limit } = this.utils.getPaginationQuery(
        __query.page,
        __query.limit
      );

      let result = await this.validators.user.getUsers({
        page,
        limit,
      });
      if (result) return { errors: result };

      const users = await this.mongomodels.user
        .find()
        .select("-password")
        .skip((page - 1) * limit)
        .limit(limit);

      return {
        data: users,
      };
    } catch (error) {
      console.error(error);

      return {
        error:
          this.utils.extractMongooseErrors(error) ?? "Error fetching users",
      };
    }
  }

  // Fetches a user by ID (Superadmin only)
  async getUserById({ __longToken, __superAdmin, __query }) {
    try {
      const id = __query.id;

      let result = await this.validators.user.getUserById({
        id,
      });
      if (result) return { errors: result };

      const user = await this.mongomodels.user
        .findOne({ _id: id })
        .select("-password");

      return {
        data: user,
        code: user ? 200 : 404,
        ...(!user ? { error: "User does not exist" } : {}),
      };
    } catch (error) {
      console.error(error);

      return {
        error: this.utils.extractMongooseErrors(error) ?? "Error fetching user",
      };
    }
  }

  // Fetches a list of users that matches a search text (Superadmin only)
  async searchUser({ __longToken, __superAdmin, __query }) {
    try {
      const search = __query.search;
      const { page, limit } = this.utils.getPaginationQuery(
        __query.page,
        __query.limit
      );

      let result = await this.validators.user.searchUser({
        search,
        page,
        limit,
      });
      if (result) return { errors: result };

      const users = await this.mongomodels.user
        .find({
          $or: [
            { username: { $regex: new RegExp(search, "i") } },
            { email: { $regex: new RegExp(search, "i") } },
          ],
        })
        .select("-password")
        .skip((page - 1) * limit)
        .limit(limit);

      return {
        data: users,
      };
    } catch (error) {
      console.error(error);

      return {
        error:
          this.utils.extractMongooseErrors(error) ?? "Error fetching users",
      };
    }
  }

  // Updates user details (Superadmin only)
  async updateUser({
    __longToken,
    __superAdmin,
    id,
    username,
    email,
    role,
    schoolId,
    password,
  }) {
    try {
      let result = await this.validators.user.updateUser({
        id,
        username,
        email,
        role,
        schoolId,
        password,
      });
      if (result) return { errors: result };

      const updatedUser = await this.mongomodels.user
        .findByIdAndUpdate(
          id,
          {
            username,
            email,
            role,
            schoolId,
            ...(password
              ? { password: await this.bcrypt.hash(password, 10) }
              : {}),
          },
          { new: true }
        )
        .select("-password");

      // User updated successfully
      return {
        data: updatedUser ?? {},
        code: updatedUser ? 200 : 404,
        ...(updatedUser ? { message: "User updated successfully" } : {}),
        ...(!updatedUser ? { error: "User does not exist" } : {}),
      };
    } catch (error) {
      console.error(error);

      return {
        error: this.utils.extractMongooseErrors(error) ?? "Error updating user",
      };
    }
  }

  // Deletes a user (Superadmin only)
  async deleteUser({ __longToken, __superAdmin, __query }) {
    // Had to make use of queries to pass the ID, no way to do delete by params
    try {
      const id = __query.id;

      let result = await this.validators.user.deleteUser({
        id,
      });
      if (result) return { errors: result };

      const item = await this.mongomodels.user.findByIdAndDelete(id);

      // User deleted successfully
      return {
        data: {},
        code: item ? 200 : 404,
        ...(item ? { message: "User deleted successfully" } : {}),
        ...(!item ? { error: "User does not exist" } : {}),
      };
    } catch (error) {
      console.error(error);

      return {
        error: this.utils.extractMongooseErrors(error) ?? "Error deleting user",
      };
    }
  }

  async auth({ __auth }) {
    return { data: __auth };
  }

  async health({ __longToken, __superAdmin }) {
    return;
  }
};

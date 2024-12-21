module.exports = ({ managers, mongomodels }) => {
  return async ({ req, res, next }) => {
    decoded = managers.token.verifyLongToken({ token: req.headers.token });

    const user = await mongomodels.user.findOne({
      _id: decoded.userId,
      role: { $in: ["admin", "superadmin"] },
    });

    // All operations allowed by superadmin
    if (user.role == "superadmin") {
      return next(true);
    }

    // Ensure admin is assigned to a school before proceeding to manage resources
    if (!user.schoolId) {
      return managers.responseDispatcher.dispatch(res, {
        ok: false,
        code: 403,
        errors: "You are not assigned to a school",
      });
    }

    /**
     * If schoolId is found in request body or
     * school is found in the request query, and
     * Accessing user is not assigned to the school being passed,
     * It is assumed that this kind of operation is not allowed
     */
    if ("schoolId" in req.body) {
      if (req.body.schoolId != user.schoolId) {
        return managers.responseDispatcher.dispatch(res, {
          ok: false,
          code: 403,
          errors: "You are not allowed to perform this operation",
        });
      }
    }

    if ("school" in req.query) {
      if (req.query.school != user.schoolId) {
        return managers.responseDispatcher.dispatch(res, {
          ok: false,
          code: 403,
          errors: "You are not allowed to perform this operation",
        });
      }
    }

    next(true);
  };
};

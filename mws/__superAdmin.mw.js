module.exports = ({ managers, mongomodels }) => {
  return async ({ req, res, next }) => {
    decoded = managers.token.verifyLongToken({ token: req.headers.token });

    const user = await mongomodels.user.findOne({
      _id: decoded.userId,
    });

    if (!user) {
      return managers.responseDispatcher.dispatch(res, {
        ok: false,
        code: 401,
        errors: "unauthorized",
      });
    }

    if (user.role != "superadmin") {
      return managers.responseDispatcher.dispatch(res, {
        ok: false,
        code: 403,
        errors: "unauthorized",
      });
    }

    next(true);
  };
};

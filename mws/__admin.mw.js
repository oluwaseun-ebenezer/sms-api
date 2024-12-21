module.exports = ({ managers, mongomodels }) => {
  return async ({ req, res, next }) => {
    decoded = managers.token.verifyLongToken({ token: req.headers.token });

    const user = await mongomodels.user.findOne({
      _id: decoded.userId,
      role: { $in: ["admin", "superadmin"] },
    });

    if (!user) {
      return managers.responseDispatcher.dispatch(res, {
        ok: false,
        code: 401,
        errors: "unauthorized",
      });
    }

    next(true);
  };
};

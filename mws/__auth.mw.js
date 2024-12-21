module.exports = ({ managers, mongomodels, bcrypt }) => {
  return async ({ req, res, next }) => {
    // Get the Authorization header
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Basic ")) {
      return res
        .status(401)
        .json({ message: "Missing or invalid Authorization header" });
    }

    // Decode Base64 credentials
    const base64Credentials = authHeader.split(" ")[1];
    const credentials = Buffer.from(base64Credentials, "base64").toString(
      "ascii"
    );
    const [email, password] = credentials.split(":");

    // Check if user exists
    const user = await mongomodels.user.findOne({ email });

    if (!user) {
      return managers.responseDispatcher.dispatch(res, {
        ok: false,
        code: 404,
        error: "User not identified",
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return managers.responseDispatcher.dispatch(res, {
        ok: false,
        code: 401,
        error: "Invalid credentials",
      });
    }

    next(
      managers.token.genLongToken({
        userId: user._id,
        userKey: null, // it is assummed that userkey are not really necessary to generate a long token
      })
    );
  };
};

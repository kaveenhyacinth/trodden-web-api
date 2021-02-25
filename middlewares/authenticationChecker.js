const expressJwt = require("express-jwt");

// Saving and signin to auth object in req
const isSignedIn = expressJwt({
  secret: process.env.SUPER_SECRET,
  userProperty: "auth",
  algorithms: ["sha1", "RS256", "HS256"],
});

// check whether the user is authenticated or not
const isAuthenticated = (req, res, next) => {
  const isOwner =
    (req.auth.id == req.body.userId || req.auth.id == req.params.userId) ??
    false;
  if (!isOwner) {
    return res.status(401).json({
      result: null,
      success: false,
      msg: "Unauthorized Action",
    });
  }
  next();
};

module.exports = {
  isSignedIn,
  isAuthenticated,
};

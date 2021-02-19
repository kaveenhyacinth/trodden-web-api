const expressJwt = require("express-jwt");

// Saving and signin to auth object in req
const isSignedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: "auth",
  algorithms: ["sha1", "RS256", "HS256"],
});

// check whether the user is authenticated or not
const isAuthenticated = (req, res, next) => {
  if (!req.auth.id) {
    return res.status(403).json({
      error: "ACCESS DENIED @isAutheticated!",
    });
  }
  next();
};

module.exports = {
  isSignedIn,
  isAuthenticated,
};

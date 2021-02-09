const expressJwt = require("express-jwt");

// Saving and signin to auth object in req
const isSignedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: "auth",
  algorithms: ["sha1", "RS256", "HS256"],
});

// check whether the user is authenticated or not
const isAuthenticated = (req, res, next) => {
  // check the profile id which sent from the backend is equivalant with the id wich saved by isSignedIn
  let owner = req.profile && req.auth && req.profile._id === req.auth._id;

  if (!owner) {
    return res.status(403).json({
      error: "ACCESS DENIED!",
    });
  }
  next();
};

module.exports = {
  isSignedIn,
  isAuthenticated,
};

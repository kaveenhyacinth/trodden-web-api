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
  let owner = req.auth && req.ownerId == req.auth.id;
  // console.debug("owner @isAuthenticated: " + owner); // <- clg

  if (!owner) {
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

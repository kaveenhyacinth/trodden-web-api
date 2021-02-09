const Nomad = require("../models/Nomad");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

// Check for existing emails
const checkEmail = (req, res, next) => {
  const { email } = req.body;
  Nomad.findOne({ email })
    .then((user) => {
      if (user)
        return res
          .status(400)
          .json({ msg: "User with this email already exists" });
      next();
    })
    .catch((err) => res.status(400).json(err));
};

// Check for existing usernames
const checkUsername = (req, res, next) => {
  const { username } = req.body;
  Nomad.findOne({ username })
    .then((user) => {
      if (user)
        return res
          .status(400)
          .json({ msg: "User with this username already exists" });
      next();
    })
    .catch((err) => res.status(400).json(err));
};

// Signup a user
const signup = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json(errors);

  const { firstName, lastName, username, email, password } = req.body;

  const nomad = new Nomad({
    first_name: firstName,
    last_name: lastName,
    username,
    email,
    password,
  });

  nomad
    .save()
    .then(() => res.status(200).json({ msg: "Welcome to Trodden", code: 1 }))
    .catch((err) =>
      res.status(400).json({
        err,
        msg: "Error occured while signing up. Please try again!",
      })
    );
};

// signin a user
const signin = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json(errors);

  const { email, password } = req.body;
  // Find user using the email
  Nomad.findOne({ email })
    .then((nomad) => {
      // Authorize the password
      if (!nomad.authenticate(password)) {
        res.status(401).json({
          msg: "Password is not valid",
          code: 0,
        });
      }

      const { _id } = nomad;

      // Create the Auth token
      const token = jwt.sign({ _id }, process.env.SECRET);
      // Put token in cookie
      return res
        .status(200)
        .cookie("token", token, { expire: new Date() + 29 })
        .json({
          msg: "Signin Successful",
          code: 1,
          token,
        });
    })
    .catch((err) =>
      res.status(400).json({
        msg: "Email is not valid or not a registered user",
        code: 0,
        err,
      })
    );
};

// signout
const signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    msg: "User has signout successfully",
  });
};

/* Protected routes */

// Saving and signin to auth object in req
const isSignedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: "auth",
});

/* Custom middleware */

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
  checkEmail,
  checkUsername,
  signup,
  signin,
  signout,
  isSignedIn,
  isAuthenticated,
};

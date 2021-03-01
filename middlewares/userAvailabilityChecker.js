const Nomad = require("../models/Nomad");

const checkEmail = (req, res, next) => {
  const { email } = req.body;
  Nomad.findOne({ email })
    .then((user) => {
      if (user)
        return res.status(400).json({
          result: null,
          success: false,
          msg: "User with this email already exists",
        });
      next();
    })
    .catch((err) =>
      res.status(500).json({
        result: err,
        success: false,
        msg: "Internal server error",
        devmsg: "Internal server error @activateAccountController",
      })
    );
};

const checkUsername = (req, res, next) => {
  const { username } = req.body;
  Nomad.findOne({ username })
    .then((user) => {
      if (user)
        return res.status(400).json({
          result: null,
          success: false,
          msg: "User with this username already exists",
        });
      next();
    })
    .catch((err) =>
      res.status(500).json({
        result: err,
        success: false,
        msg: "Internal server error",
        devmsg: "Internal server error @activateAccountController",
      })
    );
};

module.exports = {
  checkEmail,
  checkUsername,
};

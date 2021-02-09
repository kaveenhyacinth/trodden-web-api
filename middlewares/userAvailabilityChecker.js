const Nomad = require("../models/Nomad");

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

module.exports = {
  checkEmail,
  checkUsername,
};

const Nomad = require("../models/Nomad");
const jwt = require("jsonwebtoken");

const signup = (payload) => {
  const { firstName, lastName, username, email, password } = payload;

  const nomad = new Nomad({
    first_name: firstName,
    last_name: lastName,
    username,
    email,
    password,
  });

  return nomad
    .save()
    .then(() => ({ msg: "Welcome to Trodden", success: true }))
    .catch((err) => ({
      err,
      msg: "Error occured while signing up. Please try again!",
      success: false,
    }));
};

const signin = (payload) => {
  const { email, password } = payload;

  const result = Nomad.findOne({ email })
    .then((nomad) => {
      // Authorize the password
      if (!nomad.authenticate(password)) {
        return {
          msg: "Password is not valid",
          success: false,
        };
      }

      const { _id, first_name, last_name, username, email } = nomad;
      // Create the Auth token
      const token = jwt.sign({ id: _id }, process.env.SECRET);

      return {
        msg: "Signin Successful",
        token: token,
        success: true,
        result: {
          id: _id,
          firstName: first_name,
          lastName: last_name,
          username,
          email
        }
      };
    })
    .catch((err) => ({
        msg: "Email is not valid or not a registered user",
        success: false,
        err,
      })
    );

    return result;
};

module.exports = {
  signup,
  signin
};

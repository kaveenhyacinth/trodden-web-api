const Nomad = require("../models/Nomad");
const jwt = require("jsonwebtoken");

const { sendVerificationMail } = require("../services/MailingService");

/**
 * @description Sent verification mail on sign-up
 * @param {Object} payload HTTP request body
 * @async
 */
const signup = async (payload) => {
  const { firstName, lastName, username, email, password } = payload;

  // encode user input in a jwt
  // TODO: encrypt password
  const signupToken = jwt.sign(
    { firstName, lastName, username, email, password },
    process.env.SECRET
  );

  // send mail and jwt
  try {
    const { result, success } = await sendVerificationMail(email, firstName);
    if (!success) return { result, success: false };
    return { result: { ...result, signupToken }, success: true };
  } catch (error) {
    return { result: error.message, success: false };
  }
};

// TODO: activate account
// const activate = async (payload) => {
//   // decode activate token

//   // save user into db
//   const nomad = new Nomad({
//     first_name: firstName,
//     last_name: lastName,
//     username,
//     email,
//     password,
//   });

//   try {
//     const newNomad = await nomad.save();
//     return;
//   } catch (error) {
//     return { result: error.message, success: false };
//   }
// };

// TODO: Sign in
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
          email,
        },
      };
    })
    .catch((err) => ({
      msg: "Email is not valid or not a registered user",
      success: false,
      err,
    }));

  return result;
};

module.exports = {
  signup,
  // activate,
  signin,
};

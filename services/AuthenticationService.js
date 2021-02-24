const Nomad = require("../models/Nomad");

const { sendVerificationMail } = require("../services/MailingService");
const { encrypt, decrypt } = require("../jobs/cipherEngine");
const { signJWT, verifyJWT } = require("../jobs/JWTEngine");

/**
 * @description Sent verification mail on sign-up
 * @param {Object} payload HTTP request body
 * @async
 */
const signup = async (payload) => {
  const { firstName, lastName, username, email, password } = payload;

  // encode user input in a jwt
  const JWTPayload = {
    firstName,
    lastName,
    username: encrypt(username),
    email: encrypt(email),
    password: encrypt(password),
  };

  var { result, success } = signJWT(JWTPayload);
  if (!success) return { result, success };
  const signupToken = result;
  result, (success = undefined);

  // send mail and jwt
  try {
    const { result, success } = await sendVerificationMail(email, firstName);
    if (!success) return { result, success: false };
    return { result: { ...result, signupToken }, success: true };
  } catch (error) {
    return { result: error.message, success: false };
  }
};

// TODO: Update less secure app on in google

/**
 * @description Register user account and activate
 * @param {Object} payload HTTP request body
 * @async
 */
const activate = async (payload) => {
  const { signupToken } = payload;
  const { result, success } = verifyJWT(signupToken); // <- decode signup token
  if (!success) return { result, success };
  const { firstName, lastName, username, email, password } = result;

  // save user into db
  const nomad = new Nomad({
    first_name: firstName,
    last_name: lastName,
    username: decrypt(username),
    email: decrypt(email),
    password: decrypt(password),
  });

  try {
    const newNomad = await nomad.save();
    newNomad.encry_password = undefined;
    newNomad.salt = undefined;
    return { result: newNomad, success: true };
  } catch (error) {
    return { result: error.message, success: false };
  }
};

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
      const { result, success } = signJWT({ id: _id });
      if (!success) return { result, success };
      const token = result;

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
  activate,
  signin,
};

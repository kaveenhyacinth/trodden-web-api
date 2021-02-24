const jwt = require("jsonwebtoken");

/**
 * @description sign and encode a JWT token
 * @param {Object} payload
 */
const signJWT = (payload) => {
  try {
    const token = jwt.sign(payload, process.env.SECRET);
    return { result: token, success: true };
  } catch (error) {
    return { result: error.message, success: false };
  }
};

/**
 * @description verify and decode a JWT token
 * @param {String} token JWT token to decode
 */
const verifyJWT = (token) => {
  try {
    const decodedToken = jwt.verify(token, process.env.SECRET);
    return { result: decodedToken, success: true };
  } catch (error) {
    return { result: error.message, success: false };
  }
};

module.exports = {
  signJWT,
  verifyJWT,
};

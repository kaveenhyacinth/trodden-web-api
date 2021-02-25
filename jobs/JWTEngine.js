const jwt = require("jsonwebtoken");

/**
 * @description sign and encode a JWT token with expiration time of 5m
 * @param {Object} payload
 */
const signJWT = (payload) => {
  try {
    const token = jwt.sign(payload, process.env.SIGN_TOKEN_SECRET, {
      expiresIn: "5m",
      issuer: "trodden.com",
    });
    if (!token)
      throw new Error("Something went wrong inside JWT engine when sign");
    return { result: token, success: true };
  } catch (error) {
    return { result: error.message, success: false };
  }
};

/**
 * @description sign and encode a JWT token with expiration timeof 1y for refreshing
 * @param {Object} payload
 */
const refreshJWT = (payload) => {
  try {
    const token = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "1y",
      issuer: "trodden.com",
    });
    if (!token)
      throw new Error("Something went wrong inside JWT engine when refresh");
    return { result: token, success: true };
  } catch (error) {
    return { result: error.message, success: false };
  }
};

/**
 * @description sign and encode a JWT token without an expiration time
 * @param {Object} payload
 */
const encodeJWT = (payload) => {
  try {
    const token = jwt.sign(payload, process.env.SIGN_TOKEN_SECRET, {
      issuer: "trodden.com",
    });
    if (!token)
      throw new Error("Something went wrong inside JWT engine when encode");
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
    const decodedToken = jwt.verify(token, process.env.SIGN_TOKEN_SECRET);
    if (!decodedToken)
      throw new Error("Something went wrong inside JWT engine when verify");
    return { result: decodedToken, success: true };
  } catch (error) {
    return { result: error.message, success: false };
  }
};

/**
 * @description verify and decode a refresh JWT token
 * @param {String} token JWT token to decode
 */
const verifyRefreshJWT = (token) => {
  try {
    const decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    if (!decodedToken)
      throw new Error(
        "Something went wrong inside JWT engine when verify refresh"
      );
    return { result: decodedToken, success: true };
  } catch (error) {
    return { result: error.message, success: false };
  }
};

module.exports = {
  signJWT,
  refreshJWT,
  encodeJWT,
  verifyJWT,
  verifyRefreshJWT,
};

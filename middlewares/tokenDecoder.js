const jwt = require("jsonwebtoken");

const tokenDecoder = (bearerToken) => {
  const token = bearerToken.replace("Bearer ", "");
  console.log("token @extractor: " + token);

  const id = jwt.verify(token, process.env.SECRET, (err, decodedToken) => {
    // if (err) return { msg: "Incorrect or expired link", success: false, err };
    if (err) return null;

    console.log("Decoded @ProfileService @getProfilebyId : " + decodedToken.id);
    return decodedToken.id;
  });

  return id;
};

module.exports = tokenDecoder;

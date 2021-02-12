const Nomad = require("../models/Nomad");
const jwt = require("jsonwebtoken");

const getProfilebyId = (bearerToken) => {
  const token = bearerToken.replace("Bearer ", "");
  console.log("token @extractor: " + token);

  const id = jwt.verify(token, process.env.SECRET, (err, decodedToken) => {
    // if (err) return { msg: "Incorrect or expired link", success: false, err };
    if (err) return null;

    console.log("Decoded @ProfileService @getProfilebyId : " + decodedToken.id);
    return decodedToken.id;
  });

  // const { id } = decodedToken;
  console.log("Id @ProfileService @getProfilebyId : " + id);

  return Nomad.findById(id)
    .then((nomad) => ({
      nomad,
      success: true,
    }))
    .catch((err) => ({
      nomad: null,
      success: false,
      err,
    }));
};

module.exports = {
  getProfilebyId,
};

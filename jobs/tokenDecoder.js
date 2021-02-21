const jwt = require("jsonwebtoken");

const tokenDecoder = (req, res, next) => {
  const bearerToken = req.header("Authorization");
  if (!bearerToken)
      return res.status(400).json({
        msg: "Your token has expired or invalid",
        success: false,
      });
  const token = bearerToken.replace("Bearer ", "");
  // console.log("token @extractor: " + token); // <- clg

  const id = jwt.verify(token, process.env.SECRET, (err, decodedToken) => {
    // if (err) return { msg: "Incorrect or expired link", success: false, err };
    if (err) return null;

    // console.log("Decoded @ProfileService @getProfilebyId : " + decodedToken.id);// <- clg
    return decodedToken.id;
  });

  req.ownerId = id;
  // console.log("req.owner @extractor: " + req.ownerId); // <- clg
  next();
};

module.exports = tokenDecoder;

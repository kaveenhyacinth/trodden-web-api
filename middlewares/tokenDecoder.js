const jwt = require("jsonwebtoken");

const tokenDecoder = (req, res, next) => {
  const bearerToken = req.header("Authorization");
  if (!bearerToken)
      return res.status(400).json({
        msg: "Your token has expired or invalid",
        success: false,
      });
  const token = bearerToken.replace("Bearer ", "");
  console.log("token @extractor: " + token);

  const id = jwt.verify(token, process.env.SECRET, (err, decodedToken) => {
    // if (err) return { msg: "Incorrect or expired link", success: false, err };
    if (err) return null;

    console.log("Decoded @ProfileService @getProfilebyId : " + decodedToken.id);
    return decodedToken.id;
  });

  req.ownerId = id;
  console.log("req.owner @extractor: " + req.ownerId);
  next();
};

// const tokenDecoder = (bearerToken) => {
//   const token = bearerToken.replace("Bearer ", "");
//   console.log("token @extractor: " + token);

//   const id = jwt.verify(token, process.env.SECRET, (err, decodedToken) => {
//     // if (err) return { msg: "Incorrect or expired link", success: false, err };
//     if (err) return null;

//     console.log("Decoded @ProfileService @getProfilebyId : " + decodedToken.id);
//     return decodedToken.id;
//   });

//   return id;
// };

module.exports = tokenDecoder;

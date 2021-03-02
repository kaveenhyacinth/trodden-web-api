const path = require("path");
const crypto = require("crypto");
const GridFS = require("multer-gridfs-storage");
const multer = require("multer");

// Init storage engine
const storage = new GridFS({
  url: process.env.MONGO_URI,
  file: (req, file) => {
    return new Promise((res, rej) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) return rej(err);
        const filename =
          "t-" + buf.toString("hex") + path.extname(file.originalname);
        const fileinfo = {
          filename,
          bucketName: "uploads",
        };
        res(fileinfo);
      });
    });
  },
});

const upload = multer({ storage });

module.exports = { upload };

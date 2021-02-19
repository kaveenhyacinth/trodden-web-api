const multer = require("multer");
const { v1: uuidv1 } = require("uuid");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    file.mimetype === "image/png"
      ? cb(null, req.auth.id + uuidv1() + ".png")
      : cb(null, req.auth.id + uuidv1() + ".jpeg");
  },
});

const fileFilter = (req, file, cb) => {
  file.mimetype === "image/jpeg" || file.mimetype === "image/png"
    ? cb(null, true)
    : cb(
        new Error("Invalid image type! Only upload .jpeg or .png files"),
        false
      );
};

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter,
});

module.exports = upload;

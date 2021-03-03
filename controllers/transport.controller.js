const downloadImage = (req, res) => {
  global.gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (!file || file.length === 0)
      return res.status(404).json({
        result: err,
        success: false,
        msg: "Resource not found!",
      });

    // Check if image
    if (
      file.contentType === "image/jpeg" ||
      file.contentType === "image/jpg" ||
      file.contentType === "image/png"
    ) {
      // Read output to browser
      const readstram = global.gfsBucket.openDownloadStream(file._id);
      readstram.pipe(res);
    } else {
      res.status(404).json({ err: "Not an image" });
    }
  });
};

const uploadImage = (req, res) => {
  try {
    if (!req.file)
      return res
        .status(400)
        .json({ result: null, success: false, msg: "Image couldn't upload" });

    return res.status(200).json({
      result: req.file.filename,
      success: true,
      msg: "Image has been uploaded",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ result: null, success: false, msg: "Internal Server Error" });
  }
};

module.exports = {
  downloadImage,
  uploadImage,
};

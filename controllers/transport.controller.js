const getImage = (req, res) => {
  global.gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (!file || file.length === 0)
      return res.status(404).json({
        result: err,
        success: false,
        msg: "Resource not found!",
      });

    // Check if image
    if (file.contentType === "image/jpeg" || file.contentType === "image/png") {
      // Read output to browser
      const readstram = global.gfsBucket.openDownloadStream(file._id);
      readstram.pipe(res);
    } else {
      res.status(404).json({ err: "Not an image" });
    }
  });
};

module.exports = {
  getImage,
};

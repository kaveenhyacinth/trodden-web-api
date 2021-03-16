//#region IMPORTS
const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { upload } = require("../jobs/FileStorageEngine");
const transport = require("../controllers/transport.controller");

router.get("/image/:filename", transport.downloadImage);
router.get("/video/:filename", transport.downloadVideo);

router.post("/image/add", upload.single("image"), transport.uploadImage);
router.post("/images/add", upload.array("images[]", 9), transport.uploadImages);
router.post("/videos/add", upload.array("videos[]", 2), transport.uploadVideos);

module.exports = router;

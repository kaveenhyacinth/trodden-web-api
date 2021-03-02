//#region IMPORTS
const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { upload } = require("../jobs/FileStorageEngine");
const transport = require("../controllers/transport.controller");

router.get("/image/:filename", transport.getImage);

module.exports = router;
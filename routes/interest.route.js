const express = require("express");
const router = express.Router();
const { upload } = require("../jobs/FileStorageEngine");

const {
  createInterestController,
  getInterestsController,
} = require("../controllers/interests.controller");

router.post("/new", upload.single("image"), createInterestController);
router.get("/", getInterestsController);

module.exports = router;

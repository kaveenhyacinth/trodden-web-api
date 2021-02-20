const express = require("express");
const router = express.Router();

const {
  createInterestController,
  getInterestsController,
} = require("../controllers/interests.controller");

router.post("/new", createInterestController);
router.get("/", getInterestsController);

module.exports = router;

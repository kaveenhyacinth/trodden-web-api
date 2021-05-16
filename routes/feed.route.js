const router = require("express").Router();
const { isSignedIn } = require("../middlewares/authenticationChecker");
const {
  fetchFeedController,
  fetchFeedByHashTagController,
} = require("../controllers/feed.controller");

router.get("/:userId", isSignedIn, fetchFeedController);
router.get("/:tag", isSignedIn, fetchFeedByHashTagController);

module.exports = router;

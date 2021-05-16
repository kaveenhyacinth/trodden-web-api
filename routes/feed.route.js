const router = require("express").Router();
const { isSignedIn } = require("../middlewares/authenticationChecker");
const {
  fetchFeedController,
  fetchFeedByHashTagController,
} = require("../controllers/feed.controller");

router.get("/tags/:tag", isSignedIn, fetchFeedByHashTagController);
router.get("/:userId", isSignedIn, fetchFeedController);

module.exports = router;

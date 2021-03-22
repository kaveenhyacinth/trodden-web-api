const router = require("express").Router();
const feed = require("../controllers/feed.controller");

router.get("/:userId", feed.fetchFeedController);

module.exports = router;
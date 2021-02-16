const express = require("express");
const router = express.Router();

const tokenDecoder = require("../middlewares/tokenDecoder");
const {
  isAuthenticated,
  isSignedIn,
} = require("../middlewares/authenticationChecker");
const {
  getMemosController,
  getMemoByUserController,
  createMemoController,
  updateMemoController,
  deleteMemoController,
} = require("../controllers/memory.controller");

router.get("/", getMemosController);
router.get("/:userId", getMemoByUserController);
router.post(
  "/post",
  tokenDecoder,
  isSignedIn,
  isAuthenticated,
  createMemoController
);
router.put(
  "/update/:postId",
  tokenDecoder,
  isSignedIn,
  isAuthenticated,
  updateMemoController
);
router.delete("/delete", deleteMemoController);

module.exports = router;

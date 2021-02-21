const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multerUploader");

// const tokenDecoder = require("../middlewares/tokenDecoder");
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
  commentOnMemoController,
  heatOnMemoryController,
} = require("../controllers/memory.controller");

/**
 * @description Get all memories of the signed user : Protected
 * @name get/memories
 */
router.get("/", isSignedIn, isAuthenticated, getMemosController);

/**
 * @description Get all memories of a specific user
 * @name get/memoriesByUser
 */
router.get("/:userId", getMemoByUserController);

/**
 * @description create a new memory : Protected
 * @name post/createMemory
 */
router.post(
  "/new",
  isSignedIn,
  isAuthenticated,
  upload.single("images"),
  createMemoController
);

/**
 * @description update an existing memory : Protected
 * @name put/updateMemory
 */
router.put(
  "/update/:postId",
  isSignedIn,
  isAuthenticated,
  updateMemoController
);

/**
 * @description Comment on a memory
 * @name put/commmentOnMemory
 */
router.put("/comment", isSignedIn, isAuthenticated, commentOnMemoController);

/**
 * @description React on a memory
 * @name patch/heatOnMemory
 */
router.patch(
  "/heat/:postId",
  isSignedIn,
  isAuthenticated,
  heatOnMemoryController
);

/**
 * @description delete an existing memory : Protected
 * @name delete/deleteMemory
 */
router.delete("/:postId", isSignedIn, isAuthenticated, deleteMemoController);

module.exports = router;

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
  commentOnMemoController,
  heatOnMemoryController,
  checkAndCreateHashtagsController
} = require("../controllers/memory.controller");

/**
 * @description Get all memories of the signed user : Protected
 * @name get/memories
 */
router.get("/", tokenDecoder, isSignedIn, isAuthenticated, getMemosController);

/**
 * @description Get all memories of a specific user
 * @name get/memoriesByUser
 */
router.get("/:userId", getMemoByUserController);

router.post("/tags", checkAndCreateHashtagsController);

/**
 * @description create a new memory : Protected
 * @name post/createMemory
 */
router.post(
  "/post",
  tokenDecoder,
  isSignedIn,
  isAuthenticated,
  createMemoController
);

/**
 * @description update an existing memory : Protected
 * @name put/updateMemory
 */
router.put(
  "/update/:postId",
  tokenDecoder,
  isSignedIn,
  isAuthenticated,
  updateMemoController
);

/**
 * @description Comment on a memory
 * @name put/commmentOnMemory
 */
router.put("/comment", tokenDecoder, commentOnMemoController);

/**
 * @description React on a memory
 * @name patch/commmentOnMemory
 */
router.patch("/heat", tokenDecoder, heatOnMemoryController);

/**
 * @description delete an existing memory : Protected
 * @name delete/deleteMemory
 */
router.delete(
  "/:postId",
  tokenDecoder,
  isSignedIn,
  isAuthenticated,
  deleteMemoController
);

module.exports = router;

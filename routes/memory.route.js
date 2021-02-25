const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multerUploader");

//#region IMPORTS
const {
  isAuthenticated,
  isSignedIn,
} = require("../middlewares/authenticationChecker");
const {
  getMemosByUserController,
  createMemoController,
  updateMemoController,
  deleteMemoController,
  commentOnMemoController,
  heatOnMemoryController,
} = require("../controllers/memory.controller");
//#endregion

/**
 * @description Get all memories of the signed user : Protected
 * @name get/memoriesByOwner
 */
router.get(
  "/my/:userId",
  isSignedIn,
  isAuthenticated,
  getMemosByUserController
);

/**
 * @description Get all memories of a specific user
 * @name get/memoriesByUser
 */
router.get("/fetch/:userId", isSignedIn, getMemosByUserController);

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
router.put("/update", isSignedIn, isAuthenticated, updateMemoController);

/**
 * @description Comment on a memory
 * @name patch/commmentOnMemory
 */
router.patch("/comment", isSignedIn, isAuthenticated, commentOnMemoController);

/**
 * @description React on a memory
 * @name patch/heatOnMemory
 */
router.patch("/heat", isSignedIn, isAuthenticated, heatOnMemoryController);

/**
 * @description delete an existing memory : Protected
 * @name delete/deleteMemory
 */
router.delete(
  "/rm/:userId/:postId",
  isSignedIn,
  isAuthenticated,
  deleteMemoController
);

module.exports = router;

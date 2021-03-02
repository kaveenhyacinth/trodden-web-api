//#region  IMPORTS
const express = require("express");
const router = express.Router();
const {upload} = require("../jobs/FileStorageEngine");
const {
  isAuthenticated,
  isSignedIn,
} = require("../middlewares/authenticationChecker");
const {
  createBlazeController,
  getBlazeByIdController,
  getBlazesByCaravanController,
  getRecentBlazesController,
  updateBlazeController,
  markAsGoingToBlazeController,
  deleteBlazeController,
} = require("../controllers/blaze.controller");
//#endregion

/**
 * @description Create new blaze
 * @name post/createBlaze
 */
router.post(
  "/new",
  isSignedIn,
  upload.single("image"),
  isAuthenticated,
  createBlazeController
);

router.get("/", isSignedIn, getRecentBlazesController);
router.get("/i/:blazeId", isSignedIn, getBlazeByIdController);
router.get("/c/:caravanId", isSignedIn, getBlazesByCaravanController);

router.put("/u/:blazeId", isSignedIn, isAuthenticated, updateBlazeController);
router.patch(
  "/p/:blazeId",
  isSignedIn,
  isAuthenticated,
  markAsGoingToBlazeController
);

router.delete(
  "/d/:blazeId",
  isSignedIn,
  isAuthenticated,
  deleteBlazeController
);

module.exports = router;

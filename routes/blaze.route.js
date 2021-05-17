//#region  IMPORTS
const express = require("express");
const router = express.Router();
const { upload } = require("../jobs/FileStorageEngine");
const {
  isAuthenticated,
  isSignedIn,
} = require("../middlewares/authenticationChecker");
const {
  createBlazeController,
  getBlazeByIdController,
  getBlazesByCaravanController,
  getJoinedBlazesController,
  updateBlazeController,
  markAsGoingToBlazeController,
  deleteBlazeController,
  getBlazesByLocationController,
} = require("../controllers/blaze.controller");
//#endregion

/**
 * @description Create new blaze
 * @name post/createBlaze
 */
router.post("/new", isSignedIn, isAuthenticated, createBlazeController);

router.get("/j/:userId", isSignedIn, getJoinedBlazesController);
router.get("/i/:blazeId", isSignedIn, getBlazeByIdController);
router.get("/l/:locationId", isSignedIn, getBlazesByLocationController);
router.get("/c/:caravanId", isSignedIn, getBlazesByCaravanController);

router.put("/u/:blazeId", isSignedIn, isAuthenticated, updateBlazeController);
router.patch("/p", isSignedIn, isAuthenticated, markAsGoingToBlazeController);

router.delete(
  "/d/:blazeId",
  isSignedIn,
  isAuthenticated,
  deleteBlazeController
);

module.exports = router;

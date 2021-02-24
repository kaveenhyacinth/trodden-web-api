const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multerUploader");

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

router.post("/new", isSignedIn, isAuthenticated, upload.single("image"), createBlazeController);

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
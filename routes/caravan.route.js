const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multerUploader");

const {
  isAuthenticated,
  isSignedIn,
} = require("../middlewares/authenticationChecker");
const {
  createCaravanController,
  getCaravanByIdController,
  getCaravansByOwnerController,
  getCaravansByUserController,
  getCaravansByInterestsController,
  connectToCaravanController,
  updateCaravanController,
  deleteCaravanController,
} = require("../controllers/caravan.controller");

router.get("/own", isSignedIn, isAuthenticated, getCaravansByOwnerController);
router.get("/my", isSignedIn, isAuthenticated, getCaravansByUserController);
router.get(
  "/sug",
  isSignedIn,
  isAuthenticated,
  getCaravansByInterestsController
);
router.get(
  "/fetch/:caravanId",
  isSignedIn,
  isAuthenticated,
  getCaravanByIdController
);

router.post(
  "/new",
  isSignedIn,
  isAuthenticated,
  upload.single("image"),
  createCaravanController
);

router.patch(
  "/join/:caravanId",
  isSignedIn,
  isAuthenticated,
  connectToCaravanController
);
router.put(
  "/update/:caravanId",
  isSignedIn,
  isAuthenticated,
  updateCaravanController
);

router.delete(
  "/delete/:caravanId",
  isSignedIn,
  isAuthenticated,
  deleteCaravanController
);

module.exports = router;

const express = require("express");
const router = express.Router();
const {upload} = require("../jobs/FileStorageEngine");

//#region IMPORTS
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
//#endregion

/**
 * @description Get a caravan by its id
 * @name get/caravanById
 */
router.get("/fetch/:caravanId", isSignedIn, getCaravanByIdController);

/**
 * @description Get a caravan by its owner
 * @name get/caravansByOwner
 */
router.get(
  "/own/:userId",
  isSignedIn,
  isAuthenticated,
  getCaravansByOwnerController
);

/**
 * @description Get caravans where a specific user is connected
 * @name get/caravansByUser
 */
router.get(
  "/my/:userId",
  isSignedIn,
  isAuthenticated,
  getCaravansByUserController
);

/**
 * @description Get caravans by interests
 * @name get/caravansByInterests
 */
router.get("/sug/:userId", isSignedIn, getCaravansByInterestsController);

/**
 * @description Create a caravan
 * @name post/createCaravan
 */
router.post(
  "/new",
  isSignedIn,
  upload.single("image"),
  isAuthenticated,
  createCaravanController
);

/**
 * @description Connect with a caravan
 * @name patch/joinCaravan
 */
router.patch("/join", isSignedIn, isAuthenticated, connectToCaravanController);

/**
 * @description Update a caravan meta
 * @name put/updateCaravan
 */
router.put("/update", isSignedIn, isAuthenticated, updateCaravanController);

/**
 * @description Delete a caravan
 * @name delete/deleteCaravan
 */
router.delete(
  "/rm/:userId/:caravanId",
  isSignedIn,
  isAuthenticated,
  deleteCaravanController
);

module.exports = router;

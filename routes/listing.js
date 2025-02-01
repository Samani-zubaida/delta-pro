const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { loggedIn, isOwner, validateListing } = require("../middleware.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

const listingControllers = require("../controlers/listings.js");

router
  .route("/")
  .get(validateListing, wrapAsync(listingControllers.index))
  .post(loggedIn,validateListing,upload.single('listing[image]'),wrapAsync(listingControllers.createListing))
  // .get(validateListing,wrapAsync(listingControllers.searchListing)); 

router.get("/new", loggedIn, listingControllers.renderNewForm);

router
  .route("/:id")
  .get(validateListing, wrapAsync(listingControllers.showListing))
  .put(
    loggedIn,
    isOwner,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingControllers.updateListing)
  )
  .delete(loggedIn, isOwner, wrapAsync(listingControllers.deleteListing));

//edit route(step 10)
router.get(
  "/:id/edit",
  validateListing,
  loggedIn,
  isOwner,
  wrapAsync(listingControllers.editListing)
);

//Update Route

//delete route(step 11)

module.exports = router;

//DELETE REVIEW ROUTE

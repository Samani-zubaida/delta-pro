const express = require("express");
const router = express.Router({ mergeParams: true });
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {
  validateReview,
  loggedIn,
  isReviewAuthor,
} = require("../middleware.js");

const reviewController = require("../controlers/review.js");

router.post(
  "/",
  validateReview,
  loggedIn,
  wrapAsync(reviewController.createReview)
);

router.delete(
  "/:reviewId",
  loggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;

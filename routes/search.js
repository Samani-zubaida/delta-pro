const express = require("express");
const router = express.Router();
const { validateListing } = require("../middleware.js");
const wrapAsync = require("../utils/wrapAsync.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

const listingControllers = require("../controlers/selectOption.js");

router
.get("/",wrapAsync(listingControllers.search));

router.get("/find", wrapAsync(listingControllers.searchFind));

module.exports = router;

if(process.env.NODE_ENV != "production"){
  require("dotenv").config();
}


// BASIC SETUP(STEP 1) --> (STEP 2) --> listing.js
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
// const mongo_url = "mongodb://127.0.0.1:27017/wonderland";
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const dbUrl = process.env.ATLASDB_URL

const store = MongoStore.create({
  mongoUrl:dbUrl,
  crypto: {
    secret:  process.env.SECRET,
  },
  touchAfter: 24 * 60 * 60,
  
});

store.on("error" , () => {
  console.log("error in mongo session store" , err)
})

const sessionOption = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie :{
    expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge :7 * 24 * 60 * 60 * 1000,
    httpOnly : true,
  }
};

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const searchRouter = require("./routes/search.js");



main()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .then((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

//ROOT ROUTE
// app.get("/", (req, res) => {
//   res.send("root is here");
// });

app.use((req,res,next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// app.get("/demouser" ,async (req,res) => {
//   let fakeUser = new User({
//     email: "user@getMaxListeners.com",
//     username : "delta-student",
//   });

//  let registredUser = await User.register(fakeUser , "helloworld");
//  res.send(registredUser);
// })

  app.use("/listings" , listingsRouter);
  app.use("/listings/:id/reviews" , reviewsRouter);
  app.use("/" , userRouter);
  app.use("/search" , searchRouter);


  
//TESTING MODEL (STEP 3) --> (STEP 4) --> DATA.JS
// app.get("/testlisting" , async (req,res) => {
//     let sampleListing = new Listing({
//       title : "My new villa",
//       discriptions: "by beech",
//       price: 1000000,
//       location: "Bali",
//       country: "india"
// //     });

//     await  sampleListing.save();
//     console.log("sample saved");
//     res.send("sample saved");
// })

//INDEX ROUTE (STEP 6)
  //Reviews
  //post route



app.all("*", (req, res, next) => {
  next(new ExpressError(404, "page not found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something went ering" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
const User =require("../models/user");
const Listing = require("../models/listing")

module.exports.signupFormRender = (req, res) => {
    res.render("users/signup.ejs");
  };

  module.exports.signupListing = async (req, res) => {
      try {
        let { username, email, password } = req.body;
        const newUSer = new User({ email, username });
        let registeredUser = await User.register(newUSer, password);
        req.login(registeredUser,(err) => {
          if(err) {
              return next(err);
          }
          req.flash("success", "User Register Successfully");
          res.redirect("/listings");
        })
      } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
      }
    };

    module.exports.loginFormRender = async (req, res) => {
        res.render("users/login.ejs");
      };

module.exports.login =  async (req, res) => {
    req.flash("success" , "Logged in");
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
   };

   module.exports.logout = (req,res,next) => {
    req.logout((err) =>{
        if(err){
           return next(err);
        }
        req.flash("success" , "Logged Out");
        res.redirect("/listings")
    });
};
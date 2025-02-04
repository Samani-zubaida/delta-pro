const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    let allListings = await Listing.find({});
    console.log(allListings);
    res.render("listings/index.ejs", { allListings });
  };

  module.exports.renderNewForm =  (req, res) => {
    res.render("listings/new.ejs");
  };

  module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("owner");
    // console.log("the des ",listing.description);
    if (!listing) {
      req.flash("error", "Listing Does Not Exist");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
  };

  module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let fileName = req.file.filename;
      const newListing = new Listing(req.body.listing);
      console.log(req.body.listing.category);
      newListing.owner = req.user._id;
      newListing.image = {url , fileName}
      console.log(newListing);
      await newListing.save();
      req.flash("success", "New Listing Created");

      // console.log(category.enum);
      res.redirect("/listings");
    };

    module.exports.editListing = async (req, res) => {
        let { id } = req.params;
        let listing = await Listing.findById(id);
        if (!listing) {
          req.flash("error", "Listing Does Not Exist");
          res.redirect("/listings");
        }

        let orignalUrl = listing.image.url;
        orignalUrl =   orignalUrl.replace("/upload" , "/upload/w_250");
        res.render("listings/edit.ejs", { listing , orignalUrl}); 
      };

      module.exports.updateListing = async (req, res) => {
          let { id } = req.params;
          let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

          if(typeof req.file !== "undefined"){
          let url = req.file.path;
          let fileName = req.file.filename;
          listing.image = {url , fileName};
          await listing.save();
        }
          req.flash("success", "Listing Updated");
          res.redirect(`/listings/${id}`);
        };

        module.exports.deleteListing = async (req, res) => {
            let { id } = req.params;
            await Listing.findByIdAndDelete(id);
            req.flash("success", "Successfully deleted");
            res.redirect("/listings");
          };

          // module.exports.searchListing = async (req,res) => {
          //   let {country} = req.params;
          //   let listings = await Listing.find({country});
          //   res.send("these are the country");
          //   // res.render("listings/search.ejs" , {listings , country});
          // }
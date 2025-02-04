const Listing = require("../models/listing");

module.exports.search = async (req, res) => {
  let { search , filter} = req.query;
  // console.log(search);
  console.log(filter);
  let list = await Listing.find({ "country": search });
  if(list.length == 0) {
    req.flash("error", "Serached Countries Lisitng Does Not Exist ");
    res.redirect("/listings");
  } 
  res.render("listings/search.ejs", { list });
};

module.exports.searchFind = async (req,res) => {
  let {listing} = req.params;
  let {filter} = req.query;
  console.log(filter);
  let categories = await Listing.find({"category":filter});
  if(categories.length == 0){
    req.flash("error", `No listing exist in ${filter}`);
    res.redirect("/listings");
  }
  // console.log(option);
  res.render("listings/category.ejs" , {categories,listing});
}

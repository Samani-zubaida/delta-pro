//INITALIZING IT (STEP 5) --> (STEP 6) --> APP.JS
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const mongo_url = "mongodb://127.0.0.1:27017/wonderland";

main()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .then((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(mongo_url);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "6792a1633cb045c832d6cf99",
  }));
  await Listing.insertMany(initData.data);
  console.log("succesfull");
};

initDB();

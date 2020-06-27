var mongoose = require("mongoose");

var newSchema = mongoose.Schema({
  Name: String,
  Address: String,
  ContactPersonName: String,
  ContactPersonNumber: String,
  Email: String,
  GSTIN: String,
});

const admin = mongoose.model("company", newSchema);

module.exports = admin;

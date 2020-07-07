var mongoose = require("mongoose");

var newSchema = mongoose.Schema({
  Name: String,
  Address: String,
  ContactPersonName: String,
  ContactPersonNumber: Number,
  Email: String,
  GSTIN: String,
  Status: String,
  CompanyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "company",
    required: true,
  },
  lat: Number,
  long: Number,
  Link: String,
});

const admin = mongoose.model("subcompany", newSchema);

module.exports = admin;

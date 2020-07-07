var mongoose = require("mongoose");

var newSchema = mongoose.Schema({
  Name: String,
  FirstName: String,
  MiddleName: String,
  LastName: String,
  Gender: String,
  DOB: String,
  MartialStatus: String,
  Mobile: String,
  Mail: String,
  JoinDate: String,
  ConfirmationDate: String,
  TerminationDate: String,
  Prohibition: String,
  IDtype: String,
  IDNumber: String,
  Department: String,
  Designation: String,
  SubCompany: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "subcompany",
    required: true,
  },
  Timing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "timing",
    required: true,
  },
});

const admin = mongoose.model("employee", newSchema);

module.exports = admin;

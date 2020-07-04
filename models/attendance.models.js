var mongoose = require("mongoose");

var newSchema = mongoose.Schema({
  EmployeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "employee",
    required: true,
  },
  Odate: Date,
  Date: {
    type: Date,
  },
  Image: String,
  Status: String,
});

const admin = mongoose.model("attendance", newSchema);

module.exports = admin;

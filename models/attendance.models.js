var mongoose = require("mongoose");

var newSchema = mongoose.Schema({
  EmployeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "employee",
    required: true,
  },
  Date: {
    type: Date,
  },
  Image: String,
  Status: String,
});

const admin = mongoose.model("attendance", newSchema);

module.exports = admin;

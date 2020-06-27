var mongoose = require("mongoose");
const moment = require("moment-timezone");

const dateINDIA = moment.tz(Date.now(), "Asia/Calcutta");
console.log(dateINDIA);

var newSchema = mongoose.Schema({
  EmployeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "employee",
    required: true,
  },
  StartDate: {
    type: Date,
    default: dateINDIA,
  },
  Image: String,
  EndDate: {
    type: Date,
    default: dateINDIA,
  },
  Status: String,
});

const admin = mongoose.model("attendance", newSchema);

module.exports = admin;

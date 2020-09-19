var mongoose = require("mongoose");

var newSchema = mongoose.Schema({
  Name: String,
  StartTime: String,
  EndTime: String,
  WeekOff : String,
});

const timing = mongoose.model("timing", newSchema);

module.exports = timing;

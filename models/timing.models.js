var mongoose = require("mongoose");

var newSchema = mongoose.Schema({
  Name: String,
  StartTime: String,
  EndTime: String,
});

const timing = mongoose.model("timing", newSchema);

module.exports = timing;

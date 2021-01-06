var mongoose = require("mongoose");

var latlongSchema = mongoose.Schema({
  subcompany : {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subcompany",
  },
  lat : {
      type : Number
  },
  long : {
      type : Number
  },
  address : {
      type : String
  }
});

const latlong = mongoose.model("latlong", latlongSchema);

module.exports = latlong;
var mongoose = require("mongoose");

var newSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: {
        type: String,
        required: true,
      },
    password: {
        type: String,
        required: true,
      },
    firstname : {
        type : String,
        required : true,
    },
    lastname : {
        type : String,
        required : true,
    },
    Mobile : {
        type : Number,
        required : true,
    },
    email : {
        type : String,
        required : true,
    },
    rights : {
        type : String,
    }
});

const admin = mongoose.model("adduser", newSchema);

module.exports = admin;
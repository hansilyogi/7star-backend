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
});

const admin = mongoose.model("admin", newSchema);

module.exports = admin;
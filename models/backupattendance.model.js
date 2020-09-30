var mongoose = require("mongoose");

var newSchema = mongoose.Schema({
    EmployeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "employee",
        required: true,
    },
    Day: String,
    Time: String,
    Date: String,
    Image: String,
    Status: String,
    Area: String,
    Image: String,	
});

const admin = mongoose.model("backupattendance", newSchema);

module.exports = admin;

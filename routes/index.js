var express = require("express");
var router = express.Router();
const multer = require("multer");
var companySchema = require("../models/company.models");
var subcompanySchema = require("../models/subcompany.models");
var employeeSchema = require("../models/employee.model");
var attendeanceSchema = require("../models/attendance.models");
const moment = require("moment-timezone");
const dateINDIA = moment.tz(Date.now(), "Asia/Calcutta");
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/attendance");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "Attendance" + "." + file.mimetype.split("/")[1]);
  },
});

var upload = multer({ storage: storage });

router.post("/company", function (req, res, next) {
  if (req.body.type == "insert") {
    var record = new companySchema({
      Name: req.body.name,
      Address: req.body.address,
      ContactPersonName: req.body.contactpersonname,
      ContactPersonNumber: req.body.contactpersonnumber,
      Email: req.body.email,
      GSTIN: req.body.gstin,
    });
    record.save({}, function (err, record) {
      console.log(err);
      var result = {};
      if (err) {
        result.Message = "Record Not Inserted";
        result.Data = err;
        result.isSuccess = false;
      } else {
        if (record.length == 0) {
          result.Message = "Record Not Inserted";
          result.Data = [];
          result.isSuccess = false;
        } else {
          result.Message = "Record Inserted";
          result.Data = record;
          result.isSuccess = true;
        }
      }
      res.json(result);
    });
  }
});

router.post("/subcomapny", function (req, res, next) {
  if (req.body.type == "insert") {
    var record = new subcompanySchema({
      Name: req.body.name,
      Address: req.body.address,
      ContactPersonName: req.body.contactpersonname,
      ContactPersonNumber: req.body.contactpersonnumber,
      Email: req.body.email,
      GSTIN: req.body.gstin,
      Status: "Active",
      CompanyId: req.body.companyid,
    });
    record.save({}, function (err, record) {
      console.log(err);
      var result = {};
      if (err) {
        result.Message = "Record Not Inserted";
        result.Data = err;
        result.isSuccess = false;
      } else {
        if (record.length == 0) {
          result.Message = "Record Not Inserted";
          result.Data = [];
          result.isSuccess = false;
        } else {
          result.Message = "Record Inserted";
          result.Data = record;
          result.isSuccess = true;
        }
      }
      res.json(result);
    });
  }
});

router.post("/employee", function (req, res, next) {
  if (req.body.type == "insert") {
    var record = new employeeSchema({
      FirstName: req.body.firstname,
      MiddleName: req.body.middlename,
      LastName: req.body.lastname,
      Name:
        req.body.firstname +
        " " +
        req.body.middlename +
        " " +
        req.body.lastname,
      Gender: req.body.gender,
      DOB: req.body.dob,
      MartialStatus: req.body.martialstatus,
      Mobile: req.body.mobile,
      Mail: req.body.mail,
      JoinDate: req.body.joindate,
      ConfirmationDate: req.body.confirmationdate,
      TerminationDate: req.body.terminationdate,
      Prohibition: req.body.prohibition,
      Idtype: req.body.idtype,
      IDNumber: req.body.idnumber,
      Department: req.body.department,
      Designation: req.body.designation,
      SubCompany: req.body.subcompany,
    });
    record.save({}, function (err, record) {
      var result = {};
      if (err) {
        result.Message = "Record Not Inserted";
        result.Data = err;
        result.isSuccess = false;
      } else {
        if (record.length == 0) {
          result.Message = "Record Not Inserted";
          result.Data = [];
          result.isSuccess = false;
        } else {
          result.Message = "Record Inserted";
          result.Data = record;
          result.isSuccess = true;
        }
      }
      res.json(result);
    });
  }
});

router.post("/login", function (req, res, next) {
  if (req.body.type == "login") {
    console.log(req.body.number);
    employeeSchema.find({ Mobile: req.body.number }, function (err, record) {
      var result = {};
      if (err) {
        result.Message = "Employee Not Found";
        result.Data = err;
        result.isSuccess = false;
      } else {
        if (record.length == 0) {
          result.Message = "Employee Not Found";
          result.Data = [];
          result.isSuccess = false;
        } else {
          result.Message = "Employee Found";
          result.Data = record;
          result.isSuccess = true;
        }
      }
      res.json(result);
    });
  }
});

router.post("/attendance", upload.single("attendance"), function (
  req,
  res,
  next
) {
  if (req.body.type == "in") {
    var record = attendeanceSchema({
      EmployeeId: req.body.employeeid,
      Status: req.body.type,
    });
    record.save({}, function (err, record) {
      var result = {};
      if (err) {
        result.Message = "Attendance Not Marked";
        result.Data = err;
        result.isSuccess = false;
      } else {
        if (record.length == 0) {
          result.Message = "Attendance Not Marked";
          result.Data = [];
          result.isSuccess = false;
        } else {
          result.Message = "Attendance Marked";
          result.Data = record;
          result.isSuccess = true;
        }
      }
      res.json(result);
    });
  } else if (req.body.type == "out") {
    console.log(req.body.employeeid);
    attendeanceSchema.findOneAndUpdate(
      { EmployeeId: req.body.employeeid, Status: "in" },
      { $set: { EndDate: dateINDIA, Status: "out" } },
      function (err, record) {
        var result = {};
        if (err) {
          result.Message = "Attendance Not Marked";
          result.Data = err;
          result.isSuccess = false;
        } else {
          if (record.length == 0) {
            result.Message = "Attendance Not Marked";
            result.Data = [];
            result.isSuccess = false;
          } else {
            result.Message = "Attendance Marked";
            result.Data = record;
            result.isSuccess = true;
          }
        }
        res.json(result);
      }
    );
  }
});
module.exports = router;

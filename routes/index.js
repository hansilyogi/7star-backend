var express = require("express");
var router = express.Router();
var path = require("path");
const multer = require("multer");
var firebase = require("firebase-admin");
var companySchema = require("../models/company.models");
var subcompanySchema = require("../models/subcompany.models");
var employeeSchema = require("../models/employee.model");
var attendeanceSchema = require("../models/attendance.models");
var attendImg = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + "." + file.mimetype.split("/")[1]
    );
  },
});

var upload = multer({ storage: attendImg });

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
      var result = {};
      if (err) {
        result.Message = "Company Not Inserted";
        result.Data = [];
        result.isSuccess = false;
      } else {
        if (record.length == 0) {
          result.Message = "Company Not Inserted";
          result.Data = [];
          result.isSuccess = false;
        } else {
          result.Message = "New Company Inserted";
          result.Data = record;
          result.isSuccess = true;
        }
      }
      res.json(result);
    });
  } else if (req.body.type == "getdata") {
    companySchema.find({}, (err, record) => {
      var result = {};
      if (err) {
        result.Message = "Company Not Found";
        result.Data = [];
        result.isSuccess = false;
      } else {
        if (record.length == 0) {
          result.Message = "Company Not Found";
          result.Data = [];
          result.isSuccess = false;
        } else {
          result.Message = "Company Found.";
          result.Data = record;
          result.isSuccess = true;
        }
      }
      res.json(result);
    });
  }
});

router.post("/subcompany", function (req, res, next) {
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
      lat: req.body.lat,
      long: req.body.long,
      Link: req.body.googlelink,
    });
    record.save({}, function (err, record) {
      console.log(err);
      var result = {};
      if (err) {
        result.Message = "Record Not Inserted";
        result.Data = [];
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
  } else if (req.body.type == "getdata") {
    subcompanySchema
      .find()
      .populate("CompanyId")
      .then((record) => {
        var result = {};
        if (record.length == 0) {
          result.Message = "SubCompany Not Found";
          result.Data = [];
          result.isSuccess = false;
        } else {
          result.Message = "SubCompany Inserted";
          result.Data = record;
          result.isSuccess = true;
        }
        res.json(result);
      });
  } else if (req.body.type == "getcompany") {
    companySchema.find({}, (err, record) => {
      var result = {};
      if (err) {
        result.Message = "Company Not Found";
        result.Data = [];
        result.isSuccess = false;
      } else {
        if (record.length == 0) {
          result.Message = "Company Not Found";
          result.Data = [];
          result.isSuccess = false;
        } else {
          result.Message = "Company Found";
          result.Data = record;
          result.isSuccess = true;
        }
      }
      res.json(result);
    });
  } else if (req.body.type == "getsinglecompany") {
    subcompanySchema.find({ CompanyId: req.body.CompanyId }, (err, record) => {
      var result = {};
      if (err) {
        result.Message = "SubCompany Not Found";
        result.Data = err;
        result.isSuccess = false;
      } else {
        if (record.length == 0) {
          result.Message = "SubCompany Not Found";
          result.Data = [];
          result.isSuccess = false;
        } else {
          result.Message = "SubCompany Found";
          result.Data = record;
          result.isSuccess = true;
        }
      }
      res.json(result);
    });
  } else if (req.bidy.type == "getsubcompanydetail") {
    subcompanySchema.find({ _id: req.body.id }, (err, record) => {
      var result = {};
      if (err) {
        result.Message = "SubCompany Not Found";
        result.Data = err;
        result.isSuccess = false;
      } else {
        if (record.length == 0) {
          result.Message = "SubCompany Not Found";
          result.Data = [];
          result.isSuccess = false;
        } else {
          result.Message = "SubCompany Found";
          result.Data = record;
          result.isSuccess = true;
        }
      }
      res.json(result);
    });
  }
});

router.post("/employee", async function (req, res, next) {
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
  } else if (req.body.type == "getdata") {
    var record = await employeeSchema.find({}).populate("SubCompany");
    var result = {};
    if (record.length == 0) {
      result.Message = "Employee Not Found";
      result.Data = [];
      result.isSuccess = false;
    } else {
      result.Message = "Employee Found";
      result.Data = record;
      result.isSuccess = true;
    }
    res.json(result);
  } else if (req.body.type == "getsingledata") {
    var record = await employeeSchema
      .find({ _id: req.body.id })
      .populate("SubCompany");
    var result = {};
    if (record.length == 0) {
      result.Message = "Employee Not Found";
      result.Data = [];
      result.isSuccess = false;
    } else {
      result.Message = "Employee Found";
      result.Data = record;
      result.isSuccess = true;
    }
    res.json(result);
  } else if (req.body.type == "getsubcompany") {
    subcompanySchema.find({}, function (err, record) {
      var result = {};
      if (record.length == 0) {
        result.Message = "Sub Company Not Found";
        result.Data = [];
        result.isSuccess = false;
      } else {
        result.Message = "Sub Company Found";
        result.Data = record;
        result.isSuccess = true;
      }
      res.json(result);
    });
  } else if (req.body.type == "getsubcompanyemployee") {
    employeeSchema.find({ SubCompany: req.body.SubCompany }, (err, record) => {
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

router.post("/login", function (req, res, next) {
  if (req.body.type == "login") {
    console.log(req.body.number);
    employeeSchema.find({ Mobile: req.body.number }, function (err, record) {
      var result = {};
      if (err) {
        result.Message = "Employee Not Found";
        result.Data = [];
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

router.post("/attendance", upload.single("attendance"), async function (
  req,
  res,
  next
) {
  if (req.body.type == "in") {
    var longlat = await employeeSchema
      .find({ _id: req.body.employeeid })
      .populate("SubCompany");
    lon1 = req.body.longitude;
    lon2 = longlat[0]["SubCompany"].long;
    lat1 = req.body.latitude;
    lat2 = longlat[0]["SubCompany"].lat;
    unit = "K";
    var radlat1 = (Math.PI * lat1) / 180;
    var radlat2 = (Math.PI * lat2) / 180;
    var theta = lon1 - lon2;
    var radtheta = (Math.PI * theta) / 180;
    var dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit == "K") {
      dist = dist * 1.609344;
    }
    if (unit == "N") {
      dist = dist * 0.8684;
    }
    var fd = dist * 1000;
    var area = fd > 100 ? "Outside Area" : "Inside Area";
    let date = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Calcutta",
    });
    //console.log(date);
    console.log(date);
    if (req.body.filename == undefined) {
      var record = attendeanceSchema({
        EmployeeId: req.body.employeeid,
        Status: req.body.type,
        Date: date,
        Area: area,
      });
    } else {
      var record = attendeanceSchema({
        EmployeeId: req.body.employeeid,
        Status: req.body.type,
        Date: date,
        Image: req.file.filename,
        Area: area,
      });
    }
    record.save({}, function (err, record) {
      var result = {};
      if (err) {
        result.Message = "Attendance Not Marked";
        result.Data = [];
        result.isSuccess = false;
      } else {
        if (record.length == 0) {
          result.Message = "Attendance Not Marked";
          result.Data = [];
          result.isSuccess = false;
        } else {
          result.Message = "Attendance Marked";
          result.Data = [record];
          result.isSuccess = true;
        }
      }
      res.json(result);
    });
  } else if (req.body.type == "out") {
    let date = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Calcutta",
    });
    var record = attendeanceSchema({
      EmployeeId: req.body.employeeid,
      Status: req.body.type,
      Date: date,
    });
    record.save({}, function (err, record) {
      var result = {};
      if (err) {
        result.Message = "Attendance Not Marked";
        result.Data = [];
        result.isSuccess = false;
      } else {
        if (record.length == 0) {
          result.Message = "Attendance Not Marked";
          result.Data = [];
          result.isSuccess = false;
        } else {
          result.Message = "Attendance Marked";
          result.Data = [record];
          result.isSuccess = true;
        }
      }
      res.json(result);
    });
  } else if (req.body.type == "getdata") {
    if (req.body.afilter == 0) {
      var record = await attendeanceSchema.find({}).populate("EmployeeId");
    } else if (req.body.afilter == 1) {
      var record = await attendeanceSchema
        .find({ Area: "Inside Area" })
        .populate("EmployeeId");
    } else {
      var record = await attendeanceSchema
        .find({ Area: "Outside Area" })
        .populate("EmployeeId");
    }
    var result = {};
    if (record.length == 0) {
      result.Message = "Attendance Not Found";
      result.Data = [];
      result.isSuccess = false;
    } else {
      result.Message = "Attendance Found";
      result.Data = record;
      result.isSuccess = true;
    }
    res.json(result);
  } else if (req.body.type == "getsingle") {
    if (req.body.afilter == 0) {
      var record = await attendeanceSchema
        .find({ EmployeeId: req.body.EmployeeId })
        .populate("EmployeeId");
    } else if (req.body.afilter == 1) {
      var record = await attendeanceSchema
        .find({ EmployeeId: req.body.EmployeeId, Area: "Inside Area" })
        .populate("EmployeeId");
    } else {
      var record = await attendeanceSchema
        .find({ EmployeeId: req.body.EmployeeId, Area: "Outside Area" })
        .populate("EmployeeId");
    }
    var result = {};
    if (record.length == 0) {
      result.Message = "Employee Not Found";
      result.Data = [];
      result.isSuccess = false;
    } else {
      result.Message = "Employee Found";
      result.Data = record;
      result.isSuccess = true;
    }
    res.json(result);
  }
});

router.post("/location", async (req, res) => {
  var dbRef = firebase.database().ref("Database");
  const data = await dbRef.once("value", function (snapshot) {
    return snapshot.val();
  });
  res.json(data);
});

router.post("/testing", async (req, res) => {
  var data = await attendeanceSchema.find().populate({
    path: "EmployeeId",
    populate: {
      path: "SubCompany",
      populate: {
        path: "CompanyId",
        model: companySchema,
        match: { CompanyId: "5ef77f1f2160c400240c4fab" },
      },
    },
  });
  res.json(data);
});

module.exports = router;

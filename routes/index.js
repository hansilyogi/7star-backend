var express = require("express");
var router = express.Router();
var path = require("path");
const multer = require("multer");
var firebase = require("firebase-admin");
var moment = require("moment-timezone");
var companySchema = require("../models/company.models");
var subcompanySchema = require("../models/subcompany.models");
var employeeSchema = require("../models/employee.model");
var attendeanceSchema = require("../models/attendance.models");
var timingSchema = require("../models/timing.models");
const mongoose = require("mongoose");
var Excel = require("exceljs");
var _ = require("lodash");
const { stat } = require("fs");
var formidable = require('formidable');
const { runInNewContext } = require("vm");



var cellArray = [];
function str(i){
    return i<0 ? "" : str(i/26-1)+String.fromCharCode(65+i%26);
}
for(var i=0;i<27*27;i++){
    cellArray[i] = str(i);
}

function convertDateFormate(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [day, mnth ,date.getFullYear()].join("/");
}
  

var attendImg = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "uploads");
    },
    filename: function(req, file, cb) {
        console.log(file);
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(
            null,
            file.fieldname +
            "-" +
            uniqueSuffix +
            "." +
            file.originalname.split(".")[1]
        );
    },
});

var empImg = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "uploads");
    },
    filename: function(req, file, cb) {
        console.log(file);
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(
            null,
            file.fieldname +
            "-" +
            uniqueSuffix +
            "." +
            file.originalname.split(".")[1]
        );
    },
});

var upload = multer({ storage: attendImg });

var uplodEmp = multer({ storage : empImg});

router.post("/company", function(req, res, next) {
    if (req.body.type == "insert") {
        var record = new companySchema({
            Name: req.body.name,
            Address: req.body.address,
            ContactPersonName: req.body.contactpersonname,
            ContactPersonNumber: req.body.contactpersonnumber,
            Email: req.body.email,
            GSTIN: req.body.gstin,
        });
        record.save({}, function(err, record) {
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
    } else if (req.body.type == "getcompany") {
        companySchema.find({ _id: req.body.id }, (err, record) => {
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
    } else if (req.body.type == "update") {
        companySchema.findByIdAndUpdate(
            req.body.id, {
                Name: req.body.name,
                Address: req.body.address,
                ContactPersonName: req.body.contactpersonname,
                ContactPersonNumber: req.body.contactpersonnumber,
                Email: req.body.email,
                GSTIN: req.body.gstin,
            },
            (err, record) => {
                var result = {};
                if (err) {
                    result.Message = "Company Not Updated";
                    result.Data = err;
                    result.isSuccess = false;
                } else {
                    if (record.length == 0) {
                        result.Message = "Company Not Updated";
                        result.Data = [];
                        result.isSuccess = false;
                    } else {
                        result.Message = "Company Updated";
                        result.Data = record;
                        result.isSuccess = true;
                    }
                }
                res.json(result);
            }
        );
    }
});

router.post("/subcompany", function(req, res, next) {
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
        record.save({}, function(err, record) {
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
    } else if (req.body.type == "getsubcompanydetail") {
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
    } else if (req.body.type == "update") {
        subcompanySchema.findByIdAndUpdate(
            req.body.id, {
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
            },
            (err, record) => {
                var result = {};
                if (err) {
                    result.Message = "SubCompany Not Updated";
                    result.Data = err;
                    result.isSuccess = false;
                } else {
                    if (record.length == 0) {
                        result.Message = "SubCompany Not Updated";
                        result.Data = [];
                        result.isSuccess = false;
                    } else {
                        result.Message = "SubCompany Updated";
                        result.Data = record;
                        result.isSuccess = true;
                    }
                }
                res.json(result);
            }
        );
    }
});

router.post("/employee", uplodEmp.single('employeeImage'), async function(req, res, next) {
    if (req.body.type == "insert") {
        console.log(req.body);
        subcompanydetail = await subcompanySchema.findById(req.body.subcompany)
        .populate("CompanyId")
        .populate({
            path: "CompanyId",
            select: "Name"
        });
        console.log(req.file.filename);
        var employeeCode = autogenerateID(req.body,subcompanydetail);
        var record = new employeeSchema({
            FirstName: req.body.firstname,
            MiddleName: req.body.middlename,
            LastName: req.body.lastname,
            Name: req.body.firstname +
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
            IDNumber: employeeCode,
            Department: req.body.department,
            Designation: req.body.designation,
            SubCompany: req.body.subcompany,
            Timing: req.body.timing,
            Image : req.file.filename,
        });
        console.log(record);
        record.save({}, function(err, record) {
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
        console.log(req.body);
        //var record = await employeeSchema.find({}).populate("SubCompany");
        var record = await employeeSchema.find({})
        .populate({
            path:"Timing",
            select:"StartTime EndTime"
        });
        console.log(record);
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
        console.log(record.length);
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
        subcompanySchema.find({}, function(err, record) {
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
    } else if (req.body.type == "getemployee") {
        var record = await employeeSchema.find({ _id: req.body.id });
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
    } else if (req.body.type == "update") {
        employeeSchema.findByIdAndUpdate(
            req.body.id, {
                FirstName: req.body.firstname,
                MiddleName: req.body.middlename,
                LastName: req.body.lastname,
                Name: req.body.firstname +
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
                Timing: req.body.timing,
            },
            (err, record) => {
                var result = {};
                if (err) {
                    result.Message = "Employee Not Updated";
                    result.Data = err;
                    result.isSuccess = false;
                } else {
                    if (record.length == 0) {
                        result.Message = "Employee Not Updated";
                        result.Data = [];
                        result.isSuccess = false;
                    } else {
                        result.Message = "Employee Updated";
                        result.Data = record;
                        result.isSuccess = true;
                    }
                }
                res.json(result);
            }
        );
    }
});

router.post("/login", function(req, res, next) {
    if (req.body.type == "login") {
        employeeSchema.find({ Mobile: req.body.number }, function(err, record) {
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

function calculatedistance(plon1, plon2, plat1, plat2) {
    lon1 = plon1;
    lon2 = plon2;
    lat1 = plat1;
    lat2 = plat2;
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
    dist = dist * 1.609344;
    return dist;
}

function getdate() {
    moment.locale("en-in");
    var attendance = {};
    var date = moment()
        .tz("Asia/Calcutta")
        .format("DD MM YYYY, h:mm:ss a")
        .split(",")[0];
    date = date.split(" ");
    date = date[0] + "/" + date[1] + "/" + date[2];
    var time = moment()
        .tz("Asia/Calcutta")
        .format("DD MM YYYY, h:mm:ss a")
        .split(",")[1];
    var day = moment().tz("Asia/Calcutta").format("dddd");
    attendance.date = date;
    attendance.time = time;
    attendance.day = day;
    return attendance;
}


router.post("/beforeattendance", async  (req, res) => {
    var date = moment()
      .tz("Asia/Calcutta")
      .format("DD MM YYYY, h:mm:ss a")
      .split(",")[0];
    date = date.split(" ");
    //date = date[0] + "/" + date[1] + "/" + date[2];
    date = date[2]+ "-" + date[1] + "-" + date[0];
    attendeanceSchema.find(
      { EmployeeId: req.body.id, Date: date, Status: "in" },
      (err, record) => {
          console.log(record);
        var result = {};
        if (err) {
          result.Message = "No Attendance Found";
          result.Data = [];
          result.isSuccess = false;
        } else {
          if (record.length == 0) {
            result.Message = "No Attendance Found";
            result.Data = [
              {
                duty: "in",
              },
            ];
            result.isSuccess = true;
          } else {
            result.Message = "Attendance Found";
            result.Data = [
              {
                duty: "out",
              },
            ];
            result.isSuccess = true;
          }
        }
        res.json(result);
      }
    );
  });
  

router.post("/attendance", upload.single("attendance"), async function(req,res,next) {
    period = getdate();
    var date = moment()
      .tz("Asia/Calcutta")
      .format("DD MM YYYY, h:mm:ss a")
      .split(",")[0];
    date = date.split(" ");
    date = date[2]+ "-" + date[1] + "-" + date[0];
    if (req.body.type == "in") {
        var longlat = await employeeSchema
            .find({ _id: req.body.employeeid })
            .populate("SubCompany");
        dist = calculatedistance(
            req.body.longitude,
            longlat[0]["SubCompany"].lat,
            req.body.latitude,
            longlat[0]["SubCompany"].long
        );
        var NAME = longlat[0]["SubCompany"].Name;
        var fd = dist * 1000;
        var area =
            fd > 100 ?
            "http://www.google.com/maps/place/" +
            req.body.latitude +
            "," +
            req.body.longitude :
            NAME;
        var record = attendeanceSchema({
            EmployeeId: req.body.employeeid,
            Status: req.body.type,
            Date: date,
            Time: period.time,
            Day: period.day,
            Image: req.file.filename,
            Area: area,
        });
       
        record.save({}, function(err, record) {
            var result = {};
            console.log(err);
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
        var longlat = await employeeSchema
            .find({ _id: req.body.employeeid })
            .populate("SubCompany");
        dist = calculatedistance(
            req.body.longitude,
            longlat[0]["SubCompany"].lat,
            req.body.latitude,
            longlat[0]["SubCompany"].long
        );
        console.log(dist);
        var NAME = longlat[0]["SubCompany"].Name;
        var fd = dist * 1000;
        var area =
            fd > 100 ?
            "http://www.google.com/maps/place/" +
            req.body.latitude +
            "," +
            req.body.longitude :
            NAME;
        var record = attendeanceSchema({
            EmployeeId: req.body.employeeid,
            Status: req.body.type,
            Date: date,
            //Date: period.date,
            Time: period.time,
            Day: period.day,
            Image: req.file.filename,
            Area: area,
        });
        record.save({}, function(err, record) {
            var result = {};
            if (err) {
                console.log(err);
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
        const day = req.body.day;
        const sdate = req.body.sd == "" ? undefined : req.body.sd;
        const edate = req.body.ed == "" ? undefined : req.body.ed;
        const area = req.body.afilter;
        const status = req.body.status;
        let query = {};
        if (req.body.rm == 0) {
            if (day) {
                if (day != "All") {
                    query.Day = day;
                }
            }
            if (sdate != undefined || edate != undefined) {
                query.Date = {
                    $gte: sdate,
                    $lte: edate,
                };
            }
            if (area) {
                if (area == 0) {} else if (area == 2) {
                    query.Area = { $regex: "http://www.google.com/maps/place/" };
                } else {
                    query.Area = area;
                }
            }
            if (status) {
                if (status == 0) {} else if (status == 1) {
                    query.Status = "in";
                } else if (status == 2) {
                    query.Status = "out";
                }
            }
        }
        var record = await attendeanceSchema.find(query).populate("EmployeeId");
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
    } else if (req.body.type == "getareafilter") {
        subcompanySchema.find({}, (err, record) => {
            var result = {};
            if (err) {
                result.Message = "SubComapny Not Found";
                result.Data = [];
                result.isSuccess = false;
            } else {
                if (record.length == 0) {
                    result.Message = "SubComapny Not Found";
                    result.Data = [];
                    result.isSuccess = false;
                } else {
                    result.Message = "SubComapny Found";
                    result.Data = record;
                    result.isSuccess = true;
                }
            }
            res.json(result);
        });
    }
});

router.post("/location", async(req, res) => {
    if (req.body.type == "getnamefrommobile") {
        record = await employeeSchema
            .find({ Mobile: req.body.mobile })
            .select("Name Mobile");
        res.json(record);
    } else {
        var dbRef = firebase.database().ref("Database");
        const data = await dbRef.once("value", function(snapshot) {
            return snapshot.val();
        });
        res.json(data);
    }
});

router.post("/timing", (req, res) => {
    console.log(req.body);
    if (req.body.type == "insert") {
        var record = timingSchema({
            Name: req.body.name,
            StartTime: req.body.st,
            EndTime: req.body.et,
            WeekOff : req.body.weekoff,
        });
        record.save({}, (err, record) => {
            var result = {};
            if (err) {
                result.Message = "Timing Not Inserted";
                result.Data = [];
                result.isSuccess = false;
            } else {
                if (record.length == 0) {
                    result.Message = "Timing Not Inserted";
                    result.Data = [];
                    result.isSuccess = false;
                } else {
                    result.Message = "New Timing Inserted";
                    result.Data = record;
                    result.isSuccess = true;
                }
            }
            res.json(result);
        });
    } else if (req.body.type == "getdata") {
        timingSchema.find({}, (err, record) => {
            var result = {};
            if (err) {
                result.Message = "Timing Not Inserted";
                result.Data = [];
                result.isSuccess = false;
            } else {
                if (record.length == 0) {
                    result.Message = "Timing Not Inserted";
                    result.Data = [];
                    result.isSuccess = false;
                } else {
                    result.Message = "New Timing Inserted";
                    result.Data = record;
                    result.isSuccess = true;
                }
            }
            res.json(result);
        });
    } else if (req.body.type == "getsingletimedata") {
        timingSchema.find({ _id: req.body.id }, (err, record) => {
            var result = {};
            if (err) {
                result.Message = "Timing Not Inserted";
                result.Data = [];
                result.isSuccess = false;
            } else {
                if (record.length == 0) {
                    result.Message = "Timing Not Inserted";
                    result.Data = [];
                    result.isSuccess = false;
                } else {
                    result.Message = "New Timing Inserted";
                    result.Data = record;
                    result.isSuccess = true;
                }
            }
            res.json(result);
        });
    } else if (req.body.type == "update") {
        timingSchema.findByIdAndUpdate(
            req.body.id, { Name: req.body.name, StartTime: req.body.st, EndTime: req.body.et, WeekOff:req.body.weekoff},
            (err, record) => {
                var result = {};
                if (err) {
                    result.Message = "Timing Not Updated";
                    result.Data = [];
                    result.isSuccess = false;
                } else {
                    if (record.length == 0) {
                        result.Message = "Timing Not Updated";
                        result.Data = [];
                        result.isSuccess = false;
                    } else {
                        result.Message = "Timing Updated";
                        result.Data = record;
                        result.isSuccess = true;
                    }
                }
                res.json(result);
            }
        );
    }
});

router.post("/testing", async(req, res) => {
    dateArray = [];
    //console.log(req.body);
    countDate(req.body.month, req.body.year);
    //startdate = dateISOformate(dateArray[1]);
    //enddate = dateISOformate(dateArray[dateArray.length-1]);
    startdate = dateArray[1];
    enddate = dateArray[dateArray.length-1];
    //console.log(dateArray);
    //startdate = "01/08/2020";
    //enddate = "31/08/2020";
    console.log(startdate);
    console.log(enddate);
    record = await attendeanceSchema.aggregate([
        {
            $match : {
                Date : {
                    "$lte":enddate,
                    "$gte":startdate
                },

            }
        },
        {
            $lookup:{
                from: "employees",
                localField: "EmployeeId",
                foreignField: "_id",
                as: "EmployeeId"
            }
        },
        { "$unwind": "$EmployeeId" },
        {
            $match :{
                "EmployeeId.SubCompany":mongoose.Types.ObjectId(req.body.company),
            }
        }
    ]);
    //console.log(record);
    /*startDate = new Date("2020-09-01").toISOString();
    endDate =  new Date("2020-09-30").toISOString();
    console.log(startDate);
    record = await attendeanceSchema.find({
                    Date:
                        {
                            $lte: endDate,
                            $gte: startDate
                        }
            }); 
    startdate = "2020-01-09";
    enddate = "2020-30-09";*/
    /*
    record = await attendeanceSchema
        .find({
            Date: {
                $gte: startdate,
                $lte: enddate,
                //$gte: dateISOformate(req.body.startdate),
                //$lte: dateISOformate(req.body.enddate),
            },
        })
        .select("EmployeeId Status Date Time Day")
        .populate({
            path: "EmployeeId",
            select: "Name",
            match: {
                SubCompany: mongoose.Types.ObjectId(req.body.company),
            },
        });*/
    if (record.length >= 0) {
        var result = [];
        record.map(async(records) => {
            if (records.EmployeeId != null) {
                result.push(records);
            }
        });
        // var memoresult = result;
        if (result.length >= 0) {
            var result = _.groupBy(result, "EmployeeId.Name");
            result = _.forEach(result, function(value, key) {
                result[key] = _.groupBy(result[key], function(item) {
                    return item.Date;
                });
            });
            result = _.forEach(result, function(value, key) {
                _.forEach(result[key], function(value, key1) {
                    result[key][key1] = _.groupBy(result[key][key1], function(item) {
                        return item.Status;
                    });
                });
            });
            console.log(result);
            try {
                var workbook = new Excel.Workbook();
                var worksheet = workbook.addWorksheet("Attendance Report");
                worksheet.columns = [
                    {header:"Sr.No",key: "Srno", width: 5 },
                    {header:"Employee Name",key: "Name", width: 16},
                    {header:"Parameters",key: "Parameters", width: 10},
                ];
                for(var columnIndex=1;columnIndex<=dateArray.length-1;columnIndex++){
                    worksheet.getCell(cellArray[2+parseInt(columnIndex)]+1).font = {bold:true};
                    worksheet.getCell(cellArray[2+parseInt(columnIndex)]+1).width = 2 ;
                    worksheet.getCell(cellArray[2+parseInt(columnIndex)]+1).value = columnIndex;
                }

                var rowIndex = 1;
                var srno = 1;
                for(var key in result){
                    var employeedate = [];
                    worksheet.getCell(cellArray[0]+parseInt(rowIndex+1)).value = srno;
                    worksheet.getCell(cellArray[1]+parseInt(rowIndex+1)).value = key;
                    var tempIndex = 0;
                    for(var tempkey in result[key]){
                        //var date = convertDateFormate(tempkey);
                        //employeedate[tempIndex] = date;
                        if(dateArray.indexOf(tempkey) != -1){
                            employeedate[tempIndex] = tempkey;
                            tempIndex++;
                        }
                    }
                    console.log(employeedate);
                                    
                    for(var column = 1;column<=dateArray.length-1;column++){
                        worksheet.getCell(cellArray[2+parseInt(column)]+parseInt(rowIndex+1)).value = "A";
                    }
                    var column = 1;
                    for(var key1 in result[key]){
                        worksheet.getCell(cellArray[2]+parseInt(rowIndex+1)).value = "Status";
                        worksheet.getCell(cellArray[2]+parseInt(rowIndex+2)).value = "In Time";
                        worksheet.getCell(cellArray[2]+parseInt(rowIndex+3)).value = "Out Time";
                        if(dateArray.indexOf(key1)!=-1){                            
                            //for(var column = 1;column<=dateArray.length-1;column++){
                            if(employeedate.findIndex(item => item == dateArray[column]) != -1){
                                console.log(key1);
                                temp = key1.split("/");
                                temp = temp[0];
                                worksheet.getCell(cellArray[2+parseInt(temp)]+parseInt(rowIndex+1)).value = "P";
                                var i = 0;
                                for(var key2 in result[key][key1]){
                                    if(key2 == "in"){
                                        //console.log(result[key][key1][key2][0]['Time']);
                                        worksheet.getCell(cellArray[2+parseInt(temp)]+parseInt(rowIndex+2)).value = result[key][key1][key2][0]['Time'];
                                    }
                                    else if(key2 == "out" ){
                                        //console.log(result[key][key1][key2][0]['Time']);
                                        worksheet.getCell(cellArray[2+parseInt(temp)]+parseInt(rowIndex+3)).value = result[key][key1][key2][0]['Time'];
                                    } 
                                    else if(i==2){
                                        break;
                                    }
                                    i++; 
                                }
                            }
                            else if(employeedate.findIndex(item => item == dateArray[column]) == -1){
                                worksheet.getCell(cellArray[2+parseInt(column)]+parseInt(rowIndex+1)).value = "A";
                            }
                            column++;  
                            
                            //}
                        }
                       
                                            
                        
                    }
                rowIndex=parseInt(rowIndex)+3;
                srno++;
                }
                worksheet.getCell('A'+parseInt(rowIndex+5)).value = "P => Present";
                worksheet.getCell('A'+parseInt(rowIndex+6)).value = "A => Absent";
                
                /* var worksheet1 = workbook.addWorksheet("Memo Report");
                worksheet.getRow(5).values = ['Employee Name', 'Date', 'Day', 'Status','In Time', 'Out Time', 'Total Working Hour'];     
                worksheet.columns = [
                    { key: "Name", width: 32 },
                    { key: "Date", width: 32 },
                    { key: "Day", width: 15 },
                    { key: "Status", width: 15 },
                    { key: "InTime", width: 15 },
                    { key: "OutTime", width: 15 },
                    {
                        
                        key: "DifferenceTime",
                        width: 28,
                    },
                ]; */   
                /*worksheet.columns = [
                    { header: "Employee Name", key: "Name", width: 32 },
                    { header: "Date", key: "Date", width: 32 },
                    { header: "Day", key: "Day", width: 15 },
                    { header: "Status", key: "Status", width: 15 },
                    { header: "In Time", key: "InTime", width: 15 },
                    { header: "Out Time", key: "OutTime", width: 15 },
                    {
                        header: "Total Working Hour",
                        key: "DifferenceTime",
                        width: 28,
                    },
                ];*/

                // worksheet1.columns = [
                //   { header: "Employee Name", key: "Name", width: 32 },
                //   { header: "Memo Type", key: "Type", width: 15 },
                //   { header: "Start and End Date", key: "Date", width: 30 },
                //   { header: "Memo Accepted", key: "Accepted", width: 15 },
                //   { header: "Memo Disapproved", key: "Disapproved", width: 15 },
                // ];

                /*for (var key in result) {
                    for (var key1 in result[key]) {
                        var i = 0;
                        for (var key2 in result[key][key1]) {
                            if (key2 == "in") {
                                if (result[key][key1]["out"] == undefined) {
                                    var outTime = "11:00:00 pm";
                                } else {
                                    var outTime = result[key][key1]["out"][i].Time;
                                }
                                worksheet.addRow({
                                    Name: key,
                                    Date: key1,
                                    Day: result[key][key1][key2][i].Day,
                                    Status: "P",
                                    InTime: result[key][key1][key2][i].Time,
                                    OutTime: outTime,
                                    DifferenceTime: secondsToHms(
                                        moment(outTime, "H:mm:ss").diff(
                                            moment(result[key][key1][key2][i].Time, "H:mm:ss"),
                                            "seconds"
                                        )
                                    ),
                                    DifferenceTime:calculateTime(result[key][key1][key2][i].Time,outTime)
                                   
                                });
                            }
                        }
                        i++;
                    }
                }*/
                // for (i = 0; i < memoresult.length; i++) {
                //   var memoData = await memoSchema
                //     .find({
                //       Eid: memoresult[i].EmployeeId._id,
                //       Type: memoresult[i].Status,
                //       Date: {
                //         $gte: req.body.startdate,
                //         $lte: req.body.enddate,
                //       },
                //     })
                //     .populate("Eid", "Name");
                //   var groupmemo = _.groupBy(memoData, "Eid.Name");
                //   var approved = 0,
                //     disapproved = 0;
                //   console.log(groupmemo);
                //   for (var key in groupmemo) {
                //     for (j = 0; j < groupmemo[key].length; j++) {
                //       if (groupmemo[key][j].Status == true) {
                //         approved++;
                //       } else {
                //         disapproved++;
                //       }
                //     }
                //     console.log(key);
                //     console.log(approved);
                //     console.log(disapproved);
                //     worksheet1.addRow({
                //       Name: key,
                //       Type: groupmemo[key][0].Type,
                //       Date: req.body.startdate + " - " + req.body.enddate,
                //       Accepted: approved,
                //       Disapproved: disapproved,
                //     });
                //   }
                // }

                await workbook.xlsx.writeFile("./reports/" + req.body.name + ".xlsx");
                var result = {
                    Message: "Excel Sheet Created",
                    Data: req.body.name + ".xlsx",
                    isSuccess: true,
                };
                res.json(result);
            } catch (err) {
                console.log("OOOOOOO this is the error: " + err);
            }
        } else {
            var result = {
                Message: "Excel Sheet Not Created",
                Data: "No Data Found",
                isSuccess: false,
            };
            res.json(result);
        }
    } else {
        var result = {
            Message: "Excel Sheet Not Created",
            Data: "No Data Found",
            isSuccess: false,
        };
        res.json(result);
    }
});

function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor((d % 3600) / 60);
    var s = Math.floor((d % 3600) % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return hDisplay + mDisplay + sDisplay;
}

router.post("/getotp", (req, res) => {
    var result = {};
    result.Message = "OPT";
    result.Data = 0;
    result.isSuccess = true;
    res.json(result);
});

function calculateTime(inTime, outTime) {
    var startTime = moment(inTime, "HH:mm:ss a");
    var endTime = moment(outTime, "HH:mm:ss a");
    var duration = moment.duration(endTime.diff(startTime));
    var hours = parseInt(duration.asHours());
    var minutes = parseInt(duration.asMinutes()) % 60;
    return hours + " hour and " + minutes + " minutes.";
}

function dateISOformate(date){
    date = date.split("/");
    date = date[2]+"-"+date[1]+"-"+date[0];
    return date;
}

var dateArray = [];

var countDate  = function(mm,yyyy){
    var year=parseInt(yyyy);
    var months=parseInt(mm);
    var startdate;
    var enddate;
    if (
    months == 01 ||
    months == 03 ||
    months == 05 ||
    months == 07 ||
    months == 08 ||
    months == 10 ||
    months == 12
    ) {
    startdate = 01;
    enddate = 31;
    } else if (
    months == 04 ||
    months == 06 ||
    months == 09 ||
    months == 11
    ) {
    startdate = 01;
    enddate = 30;
    } else if (months == 02) {
    startdate = 01;
    if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)) {
        enddate = 29;
        
    } else {
        enddate = 28;
    }
    }
    for(var index=parseInt(startdate);index<=parseInt(enddate);index++){
        if(months>9 && index<=9){
            dateArray[index] = '0'+index+'/'+months+'/'+year
        }
        else if(months<=9 && index > 9){
            dateArray[index] = index+'/0'+months+'/'+year
        }
        else if(months<=9 && index <= 9){
            dateArray[index] = '0'+index+'/0'+months+'/'+year
        }
        else if(months>9 && index > 9){
            dateArray[index] = +index+'/'+months+'/'+year
        }
    }
}

function autogenerateID(EmpDetails,CompanyDetail){
    //console.log(EmpDetails);
    //console.log(CompanyDetail.Name.replace(/\s/gi, "").toUpperCase().substr(0,3)+CompanyDetail.CompanyId.Name.replace(/\s/gi, "").toUpperCase().substr(0,3));
    //console.log(EmpDetails.firstname.toUpperCase().substr(0,3)+EmpDetails.mobile.substr(0,3)+EmpDetails.dob.substr(0,2));
    employeecode = CompanyDetail.Name.replace(/\s/gi, "").toUpperCase().substr(0,3)+CompanyDetail.CompanyId.Name.replace(/\s/gi, "").toUpperCase().substr(0,3)+
                    EmpDetails.firstname.toUpperCase().substr(0,3)+EmpDetails.mobile.substr(0,3)+EmpDetails.dob.substr(0,2);
    return employeecode;

}
/*
router.post("/testattendance", upload.single("attendance"), async function(req,res,next) {
    period = getdate();
    console.log(req.body);
    if (req.body.type == "in") {
        var longlat = await employeeSchema
            .find({ _id: req.body.employeeid })
            .populate("SubCompany");
        dist = calculatedistance(
            req.body.longitude,
            longlat[0]["SubCompany"].lat,
            req.body.latitude,
            longlat[0]["SubCompany"].long
        );
        var NAME = longlat[0]["SubCompany"].Name;
        var fd = dist * 1000;
        var area =
            fd > 100 ?
            "http://www.google.com/maps/place/" +
            req.body.latitude +
            "," +
            req.body.longitude :
            NAME;
        var record = attendeanceSchema({
            EmployeeId: req.body.employeeid,
            Status: req.body.type,
            Date: Date.now(),
            Time: period.time,
            Day: period.day,
            Image: req.file.filename,
            Area: area,
        });
       
        record.save({}, function(err, record) {
            var result = {};
            if (err) {
                console.log(err);
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
        var longlat = await employeeSchema
            .find({ _id: req.body.employeeid })
            .populate("SubCompany");
        dist = calculatedistance(
            req.body.longitude,
            longlat[0]["SubCompany"].lat,
            req.body.latitude,
            longlat[0]["SubCompany"].long
        );
        var NAME = longlat[0]["SubCompany"].Name;
        var fd = dist * 1000;
        var area =
            fd > 100 ?
            "http://www.google.com/maps/place/" +
            req.body.latitude +
            "," +
            req.body.longitude :
            NAME;
        var record = attendeanceSchema({
            EmployeeId: req.body.employeeid,
            Status: req.body.type,
            //Date: period.date,
            Date: Date.now(),
            Time: period.time,
            Day: period.day,
            Image: req.file.filename,
            Area: area,
        });
        record.save({}, function(err, record) {
            var result = {};
            if (err) {
                console.log(err);
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
        const day = req.body.day;
        const sdate = req.body.sd == "" ? undefined : req.body.sd;
        const edate = req.body.ed == "" ? undefined : req.body.ed;
        const area = req.body.afilter;
        const status = req.body.status;
        let query = {};
        if (req.body.rm == 0) {
            if (day) {
                if (day != "All") {
                    query.Day = day;
                }
            }
            if (sdate != undefined || edate != undefined) {
                query.Date = {
                    $gte: sdate,
                    $lte: edate,
                };
            }
            if (area) {
                if (area == 0) {} else if (area == 2) {
                    query.Area = { $regex: "http://www.google.com/maps/place/" };
                } else {
                    query.Area = area;
                }
            }
            if (status) {
                if (status == 0) {} else if (status == 1) {
                    query.Status = "in";
                } else if (status == 2) {
                    query.Status = "out";
                }
            }
        }
        var record = await attendeanceSchema.find(query).populate("EmployeeId");
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
    } else if (req.body.type == "getareafilter") {
        subcompanySchema.find({}, (err, record) => {
            var result = {};
            if (err) {
                result.Message = "SubComapny Not Found";
                result.Data = [];
                result.isSuccess = false;
            } else {
                if (record.length == 0) {
                    result.Message = "SubComapny Not Found";
                    result.Data = [];
                    result.isSuccess = false;
                } else {
                    result.Message = "SubComapny Found";
                    result.Data = record;
                    result.isSuccess = true;
                }
            }
            res.json(result);
        });
    }
});*/

module.exports = router;
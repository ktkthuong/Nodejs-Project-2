const Staff = require("../models/staff");
const moment = require("moment");

exports.getMuster = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  } else {
    Staff.findById(req.staff._id)
      .then((staff) => {
        console.log(staff);
        res.render("muster/muster", {
          pageTitle: "Muster",
          path: "/muster",
          staffs: staff,
          isAuthenticated: req.session.isLoggedIn
        });
      })
      .catch((err) => console.log(err));
  }
};

exports.getCheckIn = (req, res, next) => {
  Staff.findById(req.staff._id)
    .then((staff) => {
      // console.log("getCheckIn", staff);
      res.render("muster/checkin", {
        pageTitle: "Check In",
        path: "/muster/checkin",
        staffs: staff,
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch((err) => console.log(err));
};

exports.postCheckIn = (req, res, next) => {
  const workPlace = req.body.workdress;
  const startTime = new Date();

  const workStatus = true;

  const startWorkTimes = {
    startTime: startTime,
    workPlace: workPlace,
    endTime: null,
    hours: null,
  };
  req.staff
    .addStartWorkTimes(startWorkTimes, workStatus)
    .then((staff) => {
      // console.log("result", staff);
      res.render("muster/postcheckin", {
        pageTitle: "Check In",
        path: "/muster/checkin",
        staffs: staff,
      });
    })
    .catch((err) => console.log(err));
};

exports.postCheckOut = (req, res) => {
  const index = req.staff.workTimes.findIndex((i) => i);
  const workStart = req.staff.workTimes[index].startTime;
  const workEnd = new Date();
  const start = new moment(workStart);
  const end = new moment(workEnd);
  const duration = moment.duration(end.diff(start));
  const hours = (duration.as("minutes") / 60).toFixed(2);
  const workStatus = !req.staff.workStatus;
  const newEndTime = {
    endTime: end,
    hours: hours,
  };
  req.staff
    .addEndTime(newEndTime, workStatus)
    .then((staff) => {
      // console.log(staff);
      res.render("muster/checkout", {
        pageTitle: "Check Out",
        path: "/muster/checkout",
        staffs: staff,
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.getOff = (req, res, next) => {
  Staff.findById(req.staff._id)
    .then((staff) => {
      res.render("muster/off", {
        pageTitle: "Off",
        path: "/muster/off",
        staffs: staff,
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch((err) => console.log(err));
};

exports.postOff = (req, res, next) => {
  const dayStartLeave = new Date(req.body.offStart);
  const dayEndLeave = new Date(req.body.offEnd);
  const start = new moment(dayStartLeave);
  const end = new moment(dayEndLeave);
  const duration = moment.duration(end.diff(start));
  const totalDateLeave = duration.as("days");
  console.log("totalDateLeave", totalDateLeave);
  const timesLeave = req.body.timesLeave;
  const reason = req.body.reason;

  const leaveInfoList = {
    dayStartLeave: dayStartLeave,
    dayEndLeave: dayEndLeave,
    totalDateLeave: totalDateLeave,
    timesLeave: timesLeave,
    reason: reason,
  };
  req.staff
    .addLeaveInfoList(leaveInfoList)
    .then((staff) => {
      console.log("staff1", staff);
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};

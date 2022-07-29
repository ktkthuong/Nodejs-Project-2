const Staff = require("../models/staff");

exports.getStaffInfo = (req, res, next) => {
  Staff.findById(req.staff._id)
    .then((staff) => {
      console.log("staffs-info", staff.workTimes);
      res.render("other-info/staff-info", {
        path: "/staff-info",
        pageTitle: "Staff Info",
        staffs: staff,
      });
    })
    .catch((err) => console.log(er));
};

exports.getWorkInfo = (req, res, next) => {
  console.log(req.staff);
  req.staff
    .handleTotalTimes(req.staff)
    .then((staff) => {
      const overTime = staff.totalTimesWork > 8 ? staff.totalTimesWork - 8 : 0;
      const shortTime = staff.totalTimesWork < 8 ? staff.totalTimesWork - 8 : 0;
      const salary =
        staff.salaryScale * 3000000 + (overTime - shortTime) * 200000;
      console.log("overTime", overTime);
      console.log("shortTime", shortTime);
      res.render("other-info/work-info", {
        path: "/work-info",
        pageTitle: "Working Info",
        staffs: staff,
        salary: salary,
      });
    })
    .catch((err) => console.log(err));
};

exports.getCovidInfo = (req, res, next) => {
  res.render("other-info/covid-info", {
    pageTitle: "Covid Info",
    path: "/covid-info",
  });
};

exports.postBodyTemperature = (req, res, next) => {
  const temperature = req.body.nhietdo;
  const date = req.body.date;
  const time = req.body.time;
  const bodyTemperature = {
    temperature: temperature,
    time: time,
    date: date,
  };
  req.staff
    .addBodyTemperature(bodyTemperature)
    .then((result) => {
      console.log("CREATED bodyTemperature");
      res.redirect("/covid-info");
    })
    .catch((err) => console.log(err));
};

exports.postVaccineInfo = (req, res, next) => {
  const nameVaccine1 = req.body.mui1;
  const date1 = req.body.date1;
  const nameVaccine2 = req.body.mui2;
  const date2 = req.body.date2;

  const vaccineInfo = {
    nameVaccine1: nameVaccine1,
    date1: date1,
    nameVaccine2: nameVaccine2,
    date2: date2,
  };
  req.staff
    .addVaccineInfo(vaccineInfo)
    .then((result) => {
      console.log("CREATED vaccineInfo");
      res.redirect("/covid-info");
    })
    .catch((err) => console.log(err));
};

exports.postInfectCovidInfo = (req, res, next) => {
  const datePositive = req.body.nhiemcovid;
  const dateRecover = req.body.hetbenh;
  const infectCovidInfo = {
    datePositive: datePositive,
    dateRecover: dateRecover,
  };
  req.staff
    .addInfectCovidInfo(infectCovidInfo)
    .then((result) => {
      console.log("CREATED addInfectCovidInfo");
      res.redirect("/covid-info");
    })
    .catch((err) => console.log(err));
};

const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const Staff = require("../models/staff");
const deleteFile = require("../util/fileHelper");

exports.getStaffInfo = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  } else {
    Staff.findById(req.staff._id)
      .then((staff) => {
        res.render("other-info/staff-info", {
          path: "/staff-info",
          pageTitle: "Staff Info",
          staffs: staff,
          isAuthenticated: req.isLoggedIn
        });
      })
      .catch((err) => console.log(er));
  }
};

exports.postStaffInfo = (req, res, next) => {
  deleteFile(req.staff.image);
  const avatar = req.file;
  if (!avatar) {
    console.log("khong co avatar");
    res.render("other-info/staff-info", {
      path: "/staff-info",
      pageTitle: "Staff Info",
      staffs: req.session.staff,
      isAuthenticated: req.session.isLoggedIn
    });
  }
  const image = avatar.path;
  req.staff.image = image;
  req.staff
    .save()
    .then((result) => {
      console.log("postStaffInfo", result);
      res.redirect("/staff-info");
    })
    .catch((err) => console.log(err));
};

exports.getWorkInfo = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  } else {
    const page = +req.query.page || 1;
    const ITEMS_PER_PAGE = +req.query.rowpage || 3;
    let totalItems;
    req.staff.handleTotalTimes(req.staff).then((staff) => {
      const dataWork = staff.workTimes.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
      );
      console.log("dataWork", dataWork);
      totalItems = staff.workTimes.length;
      console.log("totalItems", totalItems);

      res.render("other-info/work-info", {
        path: "/work-info",
        pageTitle: "Working Info",
        staffs: staff,
        dataWork: dataWork,
        ITEMS_PER_PAGE: ITEMS_PER_PAGE,
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
        isAuthenticated: req.session.isLoggedIn
      });
    });
    // Staff.findById(req.staff._id).then((staff) => {
    //   const dataWork = staff.workTimes.slice(
    //     (page - 1) * ITEMS_PER_PAGE,
    //     page * ITEMS_PER_PAGE
    //   );
    //   console.log("dataWork", dataWork);
    //   totalItems = staff.workTimes.length;
    //   console.log("totalItems", totalItems);

    //   res.render("other-info/work-info", {
    //     path: "/work-info",
    //     pageTitle: "Working Info",
    //     staffs: staff,
    //     dataWork: dataWork,
    //     ITEMS_PER_PAGE: ITEMS_PER_PAGE,
    //     currentPage: page,
    //     hasNextPage: ITEMS_PER_PAGE * page < totalItems,
    //     hasPreviousPage: page > 1,
    //     nextPage: page + 1,
    //     previousPage: page - 1,
    //     lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
    //   });
    // });
  }
  // if (page) {
  //   Staff.findById(req.staff._id).then((staff) => {
  //     const dataWork = staff.workTimes.slice(
  //       (page - 1) * ITEMS_PER_PAGE,
  //       page * ITEMS_PER_PAGE
  //     );
  //     console.log("dataWork", dataWork);
  //     totalItems = staff.workTimes.length;
  //     console.log("totalItems", totalItems);

  //     res.render("other-info/work-info", {
  //       path: "/work-info",
  //       pageTitle: "Working Info",
  //       staffs: staff,
  //       dataWork: dataWork,
  //       ITEMS_PER_PAGE: ITEMS_PER_PAGE,
  //       currentPage: page,
  //       hasNextPage: ITEMS_PER_PAGE * page < totalItems,
  //       hasPreviousPage: page > 1,
  //       nextPage: page + 1,
  //       previousPage: page - 1,
  //       lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
  //     });
  //   });
  // } else {
  //   Staff.findById(req.staff._id).then((staff) => {
  //     let dataWork = staff.workTimes;
  //     res.render("other-info/work-info", {
  //       path: "/work-info",
  //       pageTitle: "Working Info",
  //       staffs: staff,
  //       dataWork: dataWork,
  //       ITEMS_PER_PAGE: ITEMS_PER_PAGE,
  //       currentPage: page,
  //       hasNextPage: ITEMS_PER_PAGE * page < totalItems,
  //       hasPreviousPage: page > 1,
  //       nextPage: page + 1,
  //       previousPage: page - 1,
  //       lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
  //     });
  //   });
  // }
};
// req.staff
//   .handleTotalTimes(req.staff)
//   .then((staff) => {
//     console.log("staff", staff);
//     const overTime =
//       staff.totalTimesWork > 8 ? staff.totalTimesWork - 8 : 0;
//     const shortTime =
//       staff.totalTimesWork < 8 ? staff.totalTimesWork - 8 : 0;
//     const salary =
//       staff.salaryScale * 3000000 + (overTime - shortTime) * 200000;
//     res.render("other-info/work-info", {
//       path: "/work-info",
//       pageTitle: "Working Info",
//       staffs: staff,
//       salary: salary,
//     });
//   })
//   .catch((err) => console.log(err));

exports.getCovidInfo = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  } else {
    Staff.find({ position: "staff" })
      .then((staff) => {
        res.render("other-info/covid-info", {
          pageTitle: "Covid Info",
          path: "/covid-info",
          staffs: staff,
          position: req.session.staff.position,
          isAuthenticated: req.session.isLoggedIn
        });
      })
      .catch((err) => console.log(err));
  }
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

exports.getPDF = (req, res, next) => {
  const covidId = req.params.covidId;
  Staff.findById(covidId)
    .then((staff) => {
      let temperature = staff.bodyTemperature[0]
        ? staff.bodyTemperature[0].temperature
        : "";
      let nameVaccine1 = staff.vaccineInfo[0]
        ? staff.vaccineInfo[0].nameVaccine1
        : "";
      let date1 = staff.vaccineInfo[0]
        ? staff.vaccineInfo[0].date1.getDate() +
          "/" +
          (+staff.vaccineInfo[0].date1.getMonth() + 1) +
          "/" +
          staff.vaccineInfo[0].date1.getFullYear()
        : "";
      let nameVaccine2 = staff.vaccineInfo[1]
        ? staff.vaccineInfo[1].nameVaccine2
        : "";
      let date2 = staff.vaccineInfo[0]
        ? staff.vaccineInfo[0].date2.getDate() +
          "/" +
          (+staff.vaccineInfo[0].date2.getMonth() + 1) +
          "/" +
          staff.vaccineInfo[0].date2.getFullYear()
        : "";

      const pdfName = staff.name + ".pdf";
      const pdfPath = path.join("data", "covidPdf", pdfName);
      const file = fs.createWriteStream(pdfPath);
      const pdfDoc = new PDFDocument();
      pdfDoc.pipe(file);
      pdfDoc.pipe(res);

      pdfDoc.fontSize(26).text("Staff - Covid", { underline: true });
      pdfDoc.text("---------------");
      pdfDoc.text("Ten nhan vien : " + staff.name);
      pdfDoc.text("Nhiet do: " + temperature);
      pdfDoc.text("Vaccine mui mot: " + nameVaccine1);
      pdfDoc.text("Ngay tiem: " + date1);
      pdfDoc.text("Vaccine mui 2: " + nameVaccine2);
      pdfDoc.text("Ngay tiem : " + date2);
      pdfDoc.text("---------------");
      pdfDoc.end();
    })
    .catch((err) => console.log(err));
};

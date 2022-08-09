const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const Staff = require("../models/staff");
const fileHelper = require("../util/file");

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
          isAuthenticated: req.session.isLoggedIn
        });
      })
      .catch((err) => console.log(er));
  }
};

exports.postStaffInfo = (req, res, next) => {
  fileHelper.deleteFile(req.staff.image);
  const avatar = req.file;
  if (!avatar) {
    console.log("khong co avatar");
    return res.status(422).render("other-info/staff-info", {
      path: "/staff-info",
      pageTitle: "Staff Info",
      staffs: req.session.staff,
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
      // let temperature = staff.bodyTemperature[0]
      //   ? staff.bodyTemperature[0].temperature
      //   : "";
      // let nameVaccine1 = staff.vaccineInfo[0]
      //   ? staff.vaccineInfo[0].nameVaccine1
      //   : "";
      // let date1 = staff.vaccineInfo[0]
      //   ? staff.vaccineInfo[0].date1.getDate() +
      //     "/" +
      //     (+staff.vaccineInfo[0].date1.getMonth() + 1) +
      //     "/" +
      //     staff.vaccineInfo[0].date1.getFullYear()
      //   : "";
      // let nameVaccine2 = staff.vaccineInfo[1]
      //   ? staff.vaccineInfo[1].nameVaccine2
      //   : "";
      // let date2 = staff.vaccineInfo[0]
      //   ? staff.vaccineInfo[0].date2.getDate() +
      //     "/" +
      //     (+staff.vaccineInfo[0].date2.getMonth() + 1) +
      //     "/" +
      //     staff.vaccineInfo[0].date2.getFullYear()
      //   : "";

      const pdfName = staff.name + '-' + covidId + ".pdf";
      const pdfPath = path.join("data", "covidPdf", pdfName);
      // fs.readFile(pdfPath, (err, data) => {
      //   if(err) {
      //     return next(err);
      //   }
      //   res.setHeader('Content-Type', 'application/pdf');
      //   res.setHeader('Content-Disposition', 'inline; filename="' + pdfName + '"' );
      //   res.send(data);
      // });
      // const file = fs.createReadStream(pdfPath);     
      // file.pipe(res);
      
      // const file = fs.createWriteStream(pdfPath);      
      const pdfDoc = new PDFDocument();
      res.setHeader('Content-Type', 'application/pdf');
      //res.setHeader('Content-disposition', 'inline; filename="' + pdfName + '"' );
      pdfDoc.pipe(fs.createWriteStream(pdfPath));
      // pdfDoc.pipe(file);
      pdfDoc.pipe(res);

      pdfDoc.fontSize(26).text("Staff - Covid", { underline: true });
      pdfDoc.text("---------------");
      pdfDoc.text("Ten nhan vien : " + staff.name);
      pdfDoc.text("Nhiet do: " + staff.bodyTemperature[0].temperature);
      pdfDoc.text("Vaccine mui mot: " + staff.vaccineInfo[0].nameVaccine1 );
      pdfDoc.text("Ngay tiem: " + staff.vaccineInfo[0].date1.toLocaleDateString());
      pdfDoc.text("Vaccine mui 2: " + staff.vaccineInfo[0].nameVaccine2);
      pdfDoc.text("Ngay tiem : " + staff.vaccineInfo[0].date2.toLocaleDateString());
      pdfDoc.text("---------------");
      pdfDoc.end();
    })
    .catch((err) => console.log(err));
};

// exports.getPDFTest = (req, res, next) => { 
//   // Create a document
//   const doc = new PDFDocument({bufferPages: true});

//   // Pipe its output somewhere, like to a file or HTTP response
//   // See below for browser usage
//   doc.pipe(fs.createWriteStream('output.pdf'));

//   // Embed a font, set the font size, and render some text
//   doc
//     //.font('fonts/PalatinoBold.ttf')
//     .fontSize(25)
//     .text('Some text with an embedded font!', 100, 100);

//   // Add an image, constrain it to a given size, and center it vertically and horizontally
//   // doc.image('/public/images/hinh.jpg', {
//   //   fit: [250, 300],
//   //   align: 'center',
//   //   valign: 'center'
//   // });

//   // Add another page
//   doc
//     .addPage()
//     .fontSize(25)
//     .text('Here is some vector graphics...', 100, 100);

//   // Draw a triangle
//   doc
//     .save()
//     .moveTo(100, 150)
//     .lineTo(100, 250)
//     .lineTo(200, 250)
//     .fill('#FF3300');

//   // Apply some transforms and render an SVG path with the 'even-odd' fill rule
//   doc
//     .scale(0.6)
//     .translate(470, -380)
//     .path('M 250,75 L 323,301 131,161 369,161 177,301 z')
//     .fill('red', 'even-odd')
//     .restore();

//   // Add some text with annotations
//   doc
//     .addPage()
//     .fillColor('blue')
//     .text('Here is a link!', 100, 100)
//     .underline(100, 100, 160, 27, { color: '#0000FF' })
//     .link(100, 100, 160, 27, 'http://google.com/');

//   // Finalize PDF file
//   doc.end();
//   let buffers = [];
//   doc.on('data', buffers.push.bind(buffers));
//   doc.on('end', () => {

//     let pdfData = Buffer.concat(buffers);
//     res.writeHead(200, {
//     'Content-Length': Buffer.byteLength(pdfData),
//     'Content-Type': 'application/pdf',
//     'Content-disposition': 'attachment;filename=test.pdf',})
//     .end(pdfData);

//   });
// };
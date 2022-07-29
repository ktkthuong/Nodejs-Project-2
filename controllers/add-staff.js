const Staff = require("../models/staff");

exports.getAddStaff = (req, res, next) => {
  res.render("add-staff", {
    pageTitle: "Add Staff",
    path: "/add-staff",
  });
};

exports.postAddStaff = (req, res, next) => {
  const name = req.body.name;
  const doB = req.body.doB;
  const salaryScale = req.body.salaryScale;
  const startDate = req.body.startDate;
  const department = req.body.department;
  const annualLeave = req.body.annualLeave;
  const image = req.body.image;
  const staff = new Staff({
    name: name,
    doB: doB,
    salaryScale: salaryScale,
    startDate: startDate,
    department: department,
    annualLeave: annualLeave,
    image: image,
  });
  staff
    .save()
    .then((result) => {
      console.log("Created Staff");
      res.redirect("/staff-info");
    })
    .catch((err) => console.log(err));
};

const Staff = require("../models/staff");

exports.getStaffManager = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  } else {
    Staff.find({ position: "staff" })
      .then((staff) => {
        res.render("admin/staffManager", {
          pageTitle: "Staff Manager",
          path: "/admin/staff",
          staffs: staff,
        });
      })
      .catch((err) => console.log(err));
  }
};

exports.postStaffManager = (req, res, next) => {
  if (req.body.staff === "none") {
    return res.redirect("/admin");
  }
  const idStaff = req.body.staff;
  const selectMonth = +req.body.month;
  Staff.find({ position: "staff" })
    .then((staffs) => {
      Staff.findById(idStaff)
        .then((staff) => {
          const workTimes = staff.workTimes.filter((workTime) => {
            return +workTime.startTime.getMonth() + 1 === selectMonth;
          });
          if (workTimes.length === 0) {
            return res.render("admin/postStaffManager", {
              pageTitle: "Staff Manager",
              path: "/admin/staff",
              workTimes: workTimes,
              staff: staff,
              month: selectMonth,
            });
          } else {
            return res.render("admin/postStaffManager", {
              pageTitle: "Staff Manager",
              path: "/admin/staff",
              workTimes: workTimes,
              staff: staff,
              month: selectMonth,
            });
          }
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

exports.postDeleteWorkTime = (req, res, next) => {
  const staffId = req.body.staffId;
  const workTimeId = req.body.workTime;
  Staff.findById(staffId)
    .then((staff) => {
      console.log("staffId", staffId);
      const deleteWorkTime = staff.workTimes.filter((workTime) => {
        return workTime._id.toString() !== workTimeId.toString();
      });
      staff.workTimes = deleteWorkTime;
      return staff.save();
    })
    .then((result) => {
      res.redirect("/admin/staff");
    })
    .catch((err) => console.log(err));
};

exports.postIsConfirm = (req, res, next) => {
  const staffId = req.body.staffId;
  Staff.findById(staffId)
    .then((staff) => {
      staff.isConfirm = true;
      return staff.save();
    })
    .then((result) => {
      console.log("result", result);
      res.redirect("/admin/staff");
    })
    .catch((err) => console.log(err));
};

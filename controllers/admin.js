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
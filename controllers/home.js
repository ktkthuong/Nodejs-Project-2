exports.getHome = (req, res, next) => {
  res.render("home", {
    pageTitle: "Trang Chủ",
    path: "/",
    // isAuthenticated: req.session.isLoggedIn,
  });
};

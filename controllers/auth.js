const Staff = require('../models/staff');

exports.getLogin = (req, res, next) => {
    res.render('auth/login',{
        pageTitle: 'Login',
        path: '/login' ,
        isAtheticated: false,
        errorMessage: ''
    });
};

exports.postLogin = (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    Staff.findOne({ username: username, password: password })
        .then((staff) => {
            if (!staff) {
                return res.status(422).render("auth/login", {
                    path: "/login",
                    pageTitle: "Login",
                    errorMessage: "Username or Password not match!",
                });
            }
            req.session.isLoggedIn = true;
            req.session.staff = staff;
            return req.session.save((err) => {
            res.redirect("/");
            });
        })
        .catch((err) => console.log(err));
};
  
exports.postLogout = (req, res, next) => {
    console.log("destroy", req.session.isLoggedIn);
    req.session.destroy((err) => {
      // console.log(err);
      res.redirect("/");
    });
};
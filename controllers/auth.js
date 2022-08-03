const Staff = require("../models/staff");

const bcrypt = require('bcryptjs');

exports.getLogin = (req, res, next) => {
  console.log(req.session.isLoggedIn);
  // const isLoggedIn = req
  //   .get('Cookie')
    // .slit(';')[1]
    // .trim()
    // .slit('=')[1];
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    isAuthenticated: false,
    errorMessage: "",
    isAuthenticated: req.session.isLoggedIn
  });
};

// exports.getSignup = (req, res, next) => {
//   res.render("auth/signup", {
//     pageTitle: "Signup",
//     path: "/signup",
//     isAuthenticated: false,
//     errorMessage: "",
//     isAuthenticated: req.session.isLoggedIn
//   });
// };


exports.postLogin = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  Staff.findOne({ username: username})
    .then((staff) => {
      if (!staff) {
        return res.redirect('/login');
        // return res.status(422).render("auth/login", {
        //   path: "/login",
        //   pageTitle: "Login",
        //   errorMessage: "Username or Password not match!",
        // });
      }
      // băm mật khẩu để bảo mật 
      return bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
          const staff = new Staff({
            username: username,
            password: hashedPassword,
            name: name,
            doB: doB,
            salaryScale: salaryScale,
            startDate: startDate,
            department: department,
            annualLeave: annualLeave,
            position: position,
            image: image   
          })
          return staff.save();
      })
      .then(result => {
        req.session.isLoggedIn = true;
            req.session.staff = staff;
            return req.session.save((err) => {
              res.redirect("/");
              res.redirect('/login');
            });             
       })
      // bcrypt
      // .compare(password, staff.password)
      // .then(doMatch => {
      //   if(doMatch) {
      //     // req.setHeader('Set-Cookie', 'loggedIn=true; HttpOnly');//thiết lập cookie
      //     req.session.isLoggedIn = true;
      //     req.session.staff = staff;
      //     return req.session.save((err) => {
      //       res.redirect("/");
      //     });          
      //   }
      //   res.redirect('/login');
      // })
      .catch(err => {
        console.log(err);
        res.redirect('/login');
      });
      
    })
    .catch((err) => console.log(err));
};

// exports.postSignup = (req, res, next) => {
//   const username = req.body.username;
//   const password = req.body.password;
//   const confirmPassword = req.body.confirmPassword;
//   Staff.findOne({ username: username})
//   .then(staffDoc => {
//     if(staffDoc) {
//       return res.redirect('/signup');
//     }
//     //băm mật khẩu để bảo mật 
//     return bcrypt
//     .hash(password, 12)
//     .then(hashedPassword => {
//       const staff = new Staff({
//         username: username,
//         password: hashedPassword,
//         name: name,
//         doB: doB,
//         salaryScale: salaryScale,
//         startDate: startDate,
//         department: department,
//         annualLeave: annualLeave,
//         position: position,
//         image: image   
//       })
//       return staff.save();
//     })
//     .then(result => {
//       res.redirect("/login");
//     });
//   })  
//   .catch(err => {
//     console.log(err);
//   });
// };

exports.postLogout = (req, res, next) => {
  console.log("destroy", req.session.isLoggedIn);
    //xóa phiên lưu sessions trong mongoDB compass
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

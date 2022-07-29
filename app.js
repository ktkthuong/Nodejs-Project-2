const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');//đọc các định dạng tệp

const homeRoutes = require("./routes/home");
const musterRoutes = require("./routes/muster");
const otherInfoRoutes = require("./routes/other-info");
const Staff = require("./models/staff");
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');

const errorController = require('./controllers/error');

const MONGODB_URI = 
'mongodb+srv://ktkthuong:30062010phat@cluster0.gwa1tdk.mongodb.net/shop?retryWrites=true&w=majority';

const app = express();

//kết nối session với mongodb
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'    
});

//sử dụng thư viện csrf
const csrfProtection = csrf();

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString().slice(0, 13)   + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if(
        file.mimetype === 'image/png' || 
        file.mimetype === 'image/jpg' || 
        file.mimetype ==='image/jpeg'
    ){
        cb(null, true);
    } else {
        cb(null, false);
    }     
};

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images',express.static(path.join(__dirname, 'images')));
app.use(
    session({
        secret: 'my secret', 
        resave: false, 
        saveUninitialized: false, 
        store: store
    })
);
app.use(csrfProtection);
app.use(flash())

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use((req, res, next) => {
    // throw new Error('Sync Dummy');
    if(!req.session.staff) {
        req.locals.possition = false;
        return next();
    }
    Staff.findById(req.session.staff._id)
    .then(staff => {
        if(!staff) {
            return next();
        }
      req.staff = staff;
      next();
    })
    .catch(err => {
        next(new Error(err));
    });
});

app.get('/500', errorController.get500);

app.use(homeRoutes);
app.use(musterRoutes);
app.use(otherInfoRoutes);
app.use(adminRoutes);
app.use(authRoutes);
app.use(errorController.get404);

app.use((error, req, res, next) => {
    // res.status(error.httpStatusCode).render(...);
    // res.redirect('/500');
    res.status(500).render('500', {
        pageTitle: 'Error!',
        path: '/500',
        isAuthenticated: req.session.isLoggedIn
      });
});

mongoose
    .connect(MONGODB_URI)
    .then((result) => {
        Staff.findOne()
          .then((staff) => {
            if (!staff) {
              const staff = new Staff({
                username: "admin",
                password: "123456",
                name: "Phạm Văn A",
                doB: new Date(1995, 01, 01),
                salaryScale: 1.5,
                startDate: new Date(2021, 01, 01),
                department: "Nhân sự",
                annualLeave: 12,
                position: "admin",
                image: "http://localhost:3000",
                workStatus: null,
                sConfirm: null,
                workTimes: [],
                totalTimesWork: null,
                leaveInfoList: [],
                bodyTemperature: [],
                vaccineInfo: [],
                infectCovidInfo: [],
              });
              return staff.save();
            }
        })
        .then((a) => {
            app.listen(process.env.PORT || 3000, "0.0.0.0", () => {
              console.log("Connect with mongoBD");
            });
          });
    })   
    
      .catch(err => {
        console.log(err);
    });



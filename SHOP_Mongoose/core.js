

// To create instance of Express Js.
const express = require('express');
const bodyparser = require('body-parser');   


// Import Mongoose to connect to DB
const mongoose = require('mongoose');

// Session
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

// csrf token
const csrf = require('csurf');

// Flash for showing error message
const flash = require('connect-flash'); 


// Import Path module to send HTML
const path = require('path');


// Import Controller Error
const errorController = require('./controllers/error');

// Import MongoDB Database
// const mongoConnect = require('./util/database').mongoConnect;


// Import User Modal
const  User = require('./models/user');


const MONGODB_URI = 'mongodb+srv://ravipateljigneshpatel137:Ravi3601@nodeshop.azir75m.mongodb.net/Shop';

// Creating Instance to call Expres Js.
const a = express();


// initialize MongoDB Session
const store = new MongoDBStore({
  uri: MONGODB_URI, 
  collection: 'sessions'
});


const csrfProtection = csrf();


// It will set the engine to view pug style html code
a.set('view engine', 'ejs');
// Here we define that where these templates are located to convert it into pug
a.set('views', 'views')                                             


// Accessing Module For Routing the pages with particular path
// const adminData = require('./routes/admin');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');




a.use(bodyparser.urlencoded({extended: false})); 

// For Implement Static File (CSS)
a.use(express.static(path.join(__dirname, 'public')));

// register session middleware
a.use(session({
  secret: 'my secret', 
  resave: false, 
  saveUninitialized: false,
  store: store
}));

a.use(csrfProtection);
a.use(flash());

// Creating Dummy User Middleware
a.use((req, res, next) => {
  if(!req.session.user){
    return next();
  }
  User.findById(req.session.user._id)
  .then(user => {
    req.user = user;
    next();
  })
  .catch(err => { console.log(err) });
});

a.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});


// Calling the Routing page  
a.use('/admin',adminRoutes);
a.use(shopRoutes);
a.use(authRoutes);


// This will show error page 
a.use(errorController.getError404);




// This is mongoose connect
mongoose.connect(MONGODB_URI)
.then(result => {
  a.listen(8000);
  console.log("Connected");
})
.catch(err => { console.log(err) });



            
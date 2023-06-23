

// To create instance of Express Js.
const express = require('express');
const bodyparser = require('body-parser');                  

// Import Path module to send HTML
const path = require('path');


// Import Controller Error
const errorController = require('./controllers/error');

// Import MongoDB Database
const mongoConnect = require('./util/database').mongoConnect;


// Import User Modal
const  User = require('./models/user');


// Creating Instance to call Expres Js.
const a = express();

// It will set the engine to view pug style html code
a.set('view engine', 'ejs');
// Here we define that where these templates are located to convert it into pug
a.set('views', 'views')                                             


// Accessing Module For Routing the pages with particular path
// const adminData = require('./routes/admin');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');




a.use(bodyparser.urlencoded({extended: false})); 

// For Implement Static File (CSS)
a.use(express.static(path.join(__dirname, 'public')));


// Creating Dummy User Middleware
a.use((req, res, next) => {
  User.findById("64958da0c547495effb3b057")
  .then(user => {
    req.user = new User(user.name, user.email, user.cart, user._id);
    next();
  })
  .catch(err => { console.log(err) });
});


// Calling the Routing page  
a.use('/admin',adminRoutes);
a.use(shopRoutes);


// This will show error page 
a.use(errorController.getError404);


mongoConnect(() => {
  a.listen(8000);
});






            
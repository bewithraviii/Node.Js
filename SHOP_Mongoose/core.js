

// To create instance of Express Js.
const express = require('express');
const bodyparser = require('body-parser');   


// Import Mongoose to connect to DB
const mongoose = require('mongoose');


// Import Path module to send HTML
const path = require('path');


// Import Controller Error
const errorController = require('./controllers/error');

// Import MongoDB Database
// const mongoConnect = require('./util/database').mongoConnect;


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
const authRoutes = require('./routes/auth');




a.use(bodyparser.urlencoded({extended: false})); 

// For Implement Static File (CSS)
a.use(express.static(path.join(__dirname, 'public')));


// Creating Dummy User Middleware
a.use((req, res, next) => {
  User.findById('649938a25cc6b8f0b78d047b')
  .then(user => {
    req.user = user;
    next();
  })
  .catch(err => { console.log(err) });
});


// Calling the Routing page  
a.use('/admin',adminRoutes);
a.use(shopRoutes);
a.use(authRoutes);


// This will show error page 
a.use(errorController.getError404);


// This is MongoDb connect
// mongoConnect(() => {
//   a.listen(8000);
// });


// This is mongoose connect
mongoose.connect('mongodb+srv://ravipateljigneshpatel137:Ravi3601@nodeshop.azir75m.mongodb.net/Shop')
.then(result => {
  User.findOne().then(user => {
    if(!user)
    {
      const user = new User({
        name: 'Ravi',
        email: 'ravi@test.com',
        cart: { items: [] }
      });
      user.save();
    }
  })
  a.listen(8000);
})
.catch(err => { console.log(err) });



            
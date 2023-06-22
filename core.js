// // core modules: http, https, fs, path, os


// // const http = require('http');
// // const route = require('./routes');
// // const express = require('express');
// // function reqListner(req, res) {
// // };

// // http.createServer(reqListner);
// // const server = http.createServer((req, res) => {
// //     console.log(req.url);
// //     console.log(req.method);
// //     console.log(req.headers);

// // });
// // const a = express(); 
// //next is a function which we pass through arrorw function
// // a.use((req, res, next) => {                         
// //     console.log("Middleware1");
// //     next();
// // });

// // a.use((req, res, next) => {   
// //     console.log("Middleware2");
// //     res.send('<h1>This is Express Js</h1>');
// // });


// // const server = http.createServer(a);
// // server.listen(8000);

// // a.listen(8000);
// // const server = http.createServer(route);


// // const port = "8000"
// // a.listen(port, () => {
// //     console.log(`server is running on port ${port}`);
// // });


// /*-------------------------------------------------------------------------*/



// const exp = require('constants');
// const express = require('express');
// const path = require('path');
// const bodyparser = require('body-parser');
// const expressHbs = require('express-handlebars');
// const a = express(); 

// // a.engine('hbs', expressHbs());
// // a.set('view engine', 'hbs');
// a.set('views', 'views');

// const adminRoutes = require('./routes/admin');
// const shopRoutes = require('./routes/shop');





// a.use(bodyparser.urlencoded({extended: false}));     
// a.use(express.static(path.join(__dirname, 'public')))    

// // a.use('/message',(req, res, next) => {
// //     console.log("Middleware1");
// //     res.send('<h1>This is <b>Product</b> Page</h1>')
// // });

// a.use(adminRoutes);
// a.use(shopRoutes);

// a.use((req, res, next) => {
//     res.status(404).sendFile(path.join(__dirname, 'views', 'Error404.html'));
//     // res.status(404).render('Error404', {pageTitle: 'Page Not Found'});
// });

// a.listen(8000);

/*--------------------------------------------------------------------------------*/


// To create instance of Express Js.
const express = require('express');
const bodyparser = require('body-parser');                  

// Import Path module to send HTML
const path = require('path');



// For Express Handlebars html
// const expressHbs = require('express-handlebars');


// Import Controller Error
const errorController = require('./controllers/error');

// Database Connection
// const db = require('./util/database');


//Database Connection For Sequelize
const sequelize = require('./util/database');


// Including Models 
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');




// Creating Instance to call Expres Js.
const a = express();


// Initialize Engine for handebars
// a.engine('hbs', expressHbs.engine({
//     extname: "hbs",
//     defaultLayout: 'main-layout',
//     layoutsDir: "views/layout/"
//   }));

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
  User.findByPk(1)
  .then(user => {
    req.user = user;
    next();
  })
  .catch(err => { console.log(err) });
});


// Calling the Routing page  
a.use('/admin',adminRoutes);
a.use(shopRoutes);


// This will show error page 
a.use(errorController.getError404);


// Association: Relationship between different tables
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });






sequelize
  // .sync({ force: true })
  .sync()
  .then(result => { 
    return User.findByPk(1);
    // console.log(result);
    })
  .then(user => {
    if(!user){
      return User.create({ name: 'Ravi', email: 'prirav@gmail.com'});
    }
    return  user;
  })
  .then(user => {
    return user.createCart();
  })
  .then(cart => {
    a.listen(8000);
  })
  .catch(err => { console.log(err) });

// Assiging Port to run on Localhost
// a.listen(8000);                     
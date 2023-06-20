// const express = require('express');

// const path = require('path');

// const rootDir = require('../util/path');

// const router = express.Router();

// // router.get('/',(req, res, next) => {
// //     res.send('<h1>This is Express JS</h1>')
// // });

// router.get('/',(req, res, next) => {
//     res.sendFile(path.join(rootDir, 'views', 'shop.html'));
// });

// // router.get('/',(req, res, next) => {
// //     res.render('shop');
// // });


// module.exports = router;

/*---------------------------------------------------------------------------*/





// To create instance of Express Js.
const express = require('express');  

// Import Path module to send HTML
const path = require('path');

// Inbuilt Function to use Express Js Route Method
const router = express.Router();                

// It is Used to Define the Specific file location
// const rootDir = require('../util/path')

// const adminData = require('./admin');


//Import Product Controller
const productController = require('../controllers/products');




// Set the page to Route
router.get('/', productController.getProducts);




// Create a module to use Route method
module.exports = router;                        


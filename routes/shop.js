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
const shopController = require('../controllers/shop');




// Set the page to Route
router.get('/', shopController.getIndex);


router.get('/products', shopController.getProducts);

// For delete product
// router.get('/products/delete');

// to pass id in product EX: products/6532
router.get('/products/:productId', shopController.getProduct);

router.get('/cart', shopController.getCart);

router.post('/cart', shopController.postCart);

router.get('/orders', shopController.getOrders);

router.get('/checkout', shopController.getCheckout);


// Create a module to use Route method
module.exports = router;                        


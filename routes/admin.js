// const express = require('express');
// const path = require('path');
// const rootDir = require('../util/path');
// const router = express.Router();

// router.get('/addProduct',(req, res, next) => {
//     // res.sendFile(path.join(rootDir, 'views', 'addProduct.html'));
//     res.render('addProduct', {pagetitle: 'Add Product'});
// });

// // a.post = Only Post request & a.get = only Get request.
// router.post('/product', (req, res, next) => {
//     console.log(req.body);
//     res.redirect('/');
// });

// module.exports = router;


/*--------------------------------------------------------------------------*/


// To create instance of Express Js.
const express = require('express');

// Import Path module to send HTML
const path = require('path');

// Inbuilt Function to use Express Js Route Method
const router = express.Router();

// It is Used to Define the Specific file location
// const rootDir = require('../util/path')

//Import Product Controller
const adminController = require('../controllers/admin');

// Array To Store Product
const products = [];





// Set the page to Route

// /admin/addProduct => GET
router.get('/addProduct', adminController.getAddProduct);

// /admin/products => GET
router.get('/products', adminController.getProducts);


router.get('/editProduct/:productId', adminController.getEditProduct);


// a.post = Only Post request & a.get = only Get request.

// /admin/addProduct => GET
router.post('/addProduct', adminController.postAddProduct);

router.post('/editProduct', adminController.postEditProduct);

router.post('/deleteProduct', adminController.postDeleteProduct);


// Create a module to use Route method
module.exports = router;
// exports.routes = router;
// exports.products = products;
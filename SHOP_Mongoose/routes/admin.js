

// To create instance of Express Js.
const express = require('express');


const { body } = require('express-validator');

// Import Path module to send HTML
const path = require('path');

// Inbuilt Function to use Express Js Route Method
const router = express.Router();

// It is Used to Define the Specific file location
// const rootDir = require('../util/path')

//Import Product Controller
const adminController = require('../controllers/admin');



const isAuth = require('../middleware/is-auth');




// Set the page to Route

// /admin/addProduct => GET
router.get('/addProduct', isAuth, adminController.getAddProduct);

// /admin/products => GET
router.get('/products', isAuth, adminController.getProducts);


router.get('/editProduct/:productId', isAuth, adminController.getEditProduct);

// a.post = Only Post request & a.get = only Get request.

// /admin/addProduct => GET
router.post('/addProduct', 
[
   body('title')
   .isAlphanumeric()
   .isLength({ min: 3 })
   .trim(),
   body('price')
   .isFloat(),
   body('description')
   .isLength({ min: 5, max: 400 })
   .trim() 
]
,isAuth, adminController.postAddProduct);

router.post('/editProduct', 
[
    body('title')
    .isString()
    .isLength({ min: 3 })
    .trim(),
    body('price')
    .isFloat(),
    body('description')
    .isString()
    .isLength({ min: 5, max: 400 })
    .trim() 
 ]
, isAuth, adminController.postEditProduct);

router.post('/deleteProduct', isAuth, adminController.postDeleteProduct);




// Create a module to use Route method
module.exports = router;

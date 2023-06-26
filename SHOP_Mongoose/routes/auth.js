


// To create instance of Express Js.
const express = require('express');

// Import Path module to send HTML
// const path = require('path');

const authController = require('../controllers/auth');

// Inbuilt Function to use Express Js Route Method
const router = express.Router();


router.get('/login', authController.getLogin);

router.post('/login', authController.postLogin);




module.exports = router;

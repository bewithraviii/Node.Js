


// To create instance of Express Js.
const express = require('express');

// Import Path module to send HTML
// const path = require('path');

const authController = require('../controllers/auth');

// Inbuilt Function to use Express Js Route Method
const router = express.Router();



router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login', authController.postLogin);

router.post('/signup', authController.postSignup);

router.post('/logout', authController.postLogout);




module.exports = router;

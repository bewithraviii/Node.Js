


// To create instance of Express Js.
const express = require('express');

// For Validation
const { check, body } = require('express-validator');

// Import Path module to send HTML
// const path = require('path');

const authController = require('../controllers/auth');
const User = require('../models/user');


// Inbuilt Function to use Express Js Route Method
const router = express.Router();





// GET
router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.get('/reset', authController.getReset);

router.get('/reset/:token', authController.getnewPassword);


// POST
router.post('/login',
    [
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email address.')
            .normalizeEmail(),
        body('password', 'Password has to be valid.')
            .isLength({ min: 5 })
            .isAlphanumeric()
            .trim()
    ]
, authController.postLogin);

router.post
('/signup',
[
    check('email').isEmail()
        .withMessage('Invalid Email, Please enter a valid email.')
        .custom((value, { req }) => {
            return User.findOne({ email: value })
            .then(userObj => {
                if(userObj) {
                return Promise.reject('Email Exists already, please pick a different one.');
            }
        })
    })
    .normalizeEmail(),
    body('password', 'Enter Password with numbers and text only with at least 5 characters.')
        .isLength({min: 5})
        .isAlphanumeric()
        .trim(),
        body('confirmPassword')
        .trim()
        .custom((value, {req}) => {
            if(value !== req.body.password){
                throw new Error('Password And Confirm-Password did not match.');
            }
            return true;
    })
]
, authController.postSignup);

router.post('/logout', authController.postLogout);

router.post('/reset', authController.postReset);

router.post('/updatePassword', authController.postUpdatePassword);




module.exports = router;

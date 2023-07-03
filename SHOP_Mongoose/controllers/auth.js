const User = require("../models/user");
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator');

const user = require("../models/user");


const mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'tatvapca159@gmail.com',
        pass: 'utknrghemgdongkw'
    }
});



exports.getLogin = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0){
        message = message[0];
    }
    else{
        message = null
    }
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: message,
        oldInput: { email: '', password: '' },
        validationErrors: []
    });
};

exports.getSignup = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0){
        message = message[0];
    }
    else{
        message = null
    }
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: message,
        oldInput: { name: '', email: '', password: '', confirmPassword: '' },
        validationErrors: []
    });
};



exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors.array());
        return res.status(422).render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            errorMessage: errors.array()[0].msg,
            oldInput: { email: email, password: password },
            validationErrors: errors.array()
        });
    }
    User.findOne({email: email})
    .then(user => {
        if(!user)
        {
            return res.status(422).render('auth/login', {
                path: '/login',
                pageTitle: 'Login',
                errorMessage: 'Invalid Email',
                oldInput: { email: email, password: password },
                validationErrors: []
            });
        }
        bcrypt.compare(password, user.password)
        .then(doMatch => {
            if(doMatch)
            {
                req.session.isLoggedIn = true;
                req.session.user = user;

                return res.redirect('/');
                // if page doesn't load efficiently or product not load as it is then
                // req.session.save(err => {
                //     console.log(err);
                //     res.redirect('/');
                // });
            }
            return res.status(422).render('auth/login', {
                path: '/login',
                pageTitle: 'Login',
                errorMessage: 'Invalid Password',
                oldInput: { email: email, password: password },
                validationErrors: []
            });
        })
        .catch(err => { 
            console.log(err);
            res.redirect('/login'); 
        });
        
        
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};


exports.postSignup = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors.array());
        return res.status(422).render('auth/signup', {
            path: '/signup',
            pageTitle: 'Signup',
            errorMessage: errors.array()[0].msg,
            oldInput: { name: name, email: email, password: password , confirmPassword: req.body.confirmPassword },
            validationErrors: errors.array()
        });
    }
   
         bcrypt.hash(password, 12)
        .then(hashedpassword => {
            const user = new User({
                name: name,
                email: email,
                password: hashedpassword,
                cart: { items: [] }
            });
            return user.save();
        })
        .then(result => {
            res.redirect('/login');
            return mailTransporter.sendMail({
                from: 'Shop@Node.com',
                to: email,
                subject: 'Signup Successfull on SHOP Application',
                html: '<h2>You are successfully Signed up!!</h2>'
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })

        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
};



exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/login');
    });
};


exports.getReset = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0){
        message = message[0];
    }
    else{
        message = null
    }
    res.render('auth/reset', {
        path: '/reset',
        pageTitle: 'Reset Password',
        errorMessage: message
    });
};


exports.postReset = (req, res, next) => {
    const email = req.body.email;
    crypto.randomBytes(32, (err, buffer) => {
        if (err){
            console.log(err);
            return res.redirect('/reset');
        }
        const token = buffer.toString('hex');
        User.findOne({email: email})
        .then(user => {
            if(!user){
                req.flash('error', 'No account with that email found.');
                return res.redirect('/reset');
            }
            user.resetToken = token;
            user.resetTokenExpiration = Date.now() + 3600000;
            user.save();
        })
        .then(result => {
            res.redirect('/');
            mailTransporter.sendMail({
                from: 'Shop@Node.com',
                to: email,
                subject: 'Password Reset',
                html: ` 
                        <h2>You are successfully Signed up!!</h2>
                        <p>Click this <a href="http://localhost:8000/reset/${token}">link</a> to set a new password</p>
                `
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
    });
};


exports.getnewPassword = (req, res, next) => {
    const token = req.params.token;
    User.findOne({ resetToken: token, resetTokenExpiration: {$gt: Date.now()} })
    .then(user => {
        let message = req.flash('error');
        if (message.length > 0){
            message = message[0];
        }
        else{
            message = null
        }
        res.render('auth/new-password', {
            path: '/new-password',
            pageTitle: 'New Password',
            errorMessage: message,
            userId: user._id.toString()
        });
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
    
}

exports.postUpdatePassword = (req, res, next) => {
    const id = req.body.userId;
    const updatedPassword = req.body.password;
    User.findOne({ _id: id })
    .then(user => {
        return bcrypt.hash(updatedPassword, 12)
        .then(hashedpassword => {
            user.password = hashedpassword;
            user.resetToken = null;
            user.resetTokenExpiration = null;
            return user.save();
        })
        .then(result => {
            res.redirect('/login');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
}

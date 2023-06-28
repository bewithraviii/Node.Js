const User = require("../models/user");
const bcrypt = require('bcryptjs');

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
        errorMessage: message
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
        errorMessage: message
    });
};



exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email: email})
    .then(user => {
        if(!user)
        {
            req.flash('error', 'Invalid Email or Password');
            return res.redirect('/login');
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
            req.flash('error', 'Invalid Email or Password');
            res.redirect('/login');
        })
        .catch(err => { 
            console.log(err);
            res.redirect('/login'); 
        });
        
        
    })
    .catch(err => { console.log(err) })
};


exports.postSignup = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    User.findOne({ email: email })
    .then(userObj => {
        if(userObj) {
           req.flash('error', 'E-mail already exists, please select another one...');
           return res.redirect('/signup');
        }
        return bcrypt.hash(password, 12)
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
        });
    })
    .catch(err => { console.log(err) });
};



exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/login');
    });
};

const mongodb = require('mongodb');
const Product = require('../models/product');
const fileHelper = require('../util/file');


const { validationResult } = require('express-validator');


exports.getAddProduct = (req, res, next) => {
    // if (!req.session.isLoggedIn){
    //     return res.redirect('/login');
    // }
    res.render('admin/editProduct', {
    pageTitle: 'Add Product', 
    path: '/admin/addProduct', 
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: []
    });
};



exports.postAddProduct = (req, res, next) => {
    
    const title = req.body.title;
    const image = req.file;
    const price = req.body.price;
    const description = req.body.description;
    if (!image){
        return res.status(422).render('admin/editProduct', {
            pageTitle: 'Add Product', 
            path: '/admin/editProduct',
            editing: false,
            hasError: true,
            product: {
                title: title,
                price: price,
                description: description
            },
            errorMessage: 'Attached file is not an image',
            validationErrors: []
        }); 
    }
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        console.log(errors.array());
        return res.status(422).render('admin/editProduct', {
            pageTitle: 'Add Product', 
            path: '/admin/editProduct',
            editing: false,
            hasError: true,
            product: {
                title: title,
                price: price,
                description: description
            },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        });
    }

    const product = new Product({
        title: title, 
        price: price, 
        description: description, 
        imageUrl: image.path,
        userId: req.user
    });
    product.save()
    .then(result => { 
        console.log('Created Product Through Mongoose'); 
        res.redirect('/admin/products');
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};


exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if(!editMode){
        return res.redirect('/');
    }
    const proId = req.params.productId;
    Product.findById(proId)
    .then(product => {
        if(!product){
            return res.redirect('/');
        }
        res.render('admin/editProduct', {
            pageTitle: 'Edit Product', 
            path: '/admin/editProduct',
            editing: editMode,
            product: product,
            hasError: false,
            errorMessage: null,
            validationErrors: []
        });
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const image = req.file;
    const updatedDescription = req.body.description;
    const updatedPrice = req.body.price;
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(422).render('admin/editProduct', {
            pageTitle: 'Edit Product', 
            path: '/admin/editProduct',
            editing: true,
            hasError: true,
            product: {
                title: updatedTitle,
                price: updatedPrice,
                description: updatedDescription,
                _id: prodId
            },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        });
    }

    Product.findById(prodId).then(product => {
        if (product.userId.toString() !== req.user._id.toString()){
            return res.redirect('/');
        }
        product.title = updatedTitle;
        product.price = updatedPrice; 
        product.description = updatedDescription; 
        if(image){
            fileHelper.deleteFiles(product.imageUrl);
            product.imageUrl = image.path;
        }
        return product.save().then(result => { 
            console.log("Updated Product"); 
            res.redirect('/admin/products'); 
        })
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};



exports.getProducts = (req, res, next) => {
    Product.find({ userId: req.user._id })
    //.select('title price')
    //.populate('userId', 'name')
    .then(Product => {
        res.render('admin/products', {
            prods: Product, 
            pageTitle: 'Admin Products', 
            path: '/admin/products'
        });
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};




/*
the findByIdAndRemove returns the deleted document & findByIdAndDelete does not return. 
If we want the deleted document then we can use findByIdAndRemove otherwise can use findByIdAndDelete.

Recommend:- If don't want to get the deleted document then have to use findByIdAndDelete because it's fast cause does not return the document. 
*/
exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId).then(prod => {
        if(!prod)
        {
            return next(new Error('Product Not Found'));
        }
        fileHelper.deleteFiles(prod.imageUrl);
        return Product.deleteOne({ _id: prodId, userId: req.user._id })
    })
    .then(() => {
        res.redirect('/admin/products')
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};

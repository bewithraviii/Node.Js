
const mongodb = require('mongodb');
const Product = require('../models/product');



exports.getAddProduct = (req, res, next) => {
    res.render('admin/editProduct', {
    pageTitle: 'Add Product', 
    path: '/admin/addProduct', 
    editing: false
    });
};



exports.postAddProduct = (req, res, next) => {
    
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product({
        title: title, 
        price: price, 
        description: description, 
        imageUrl: imageUrl,
        userId: req.user
    });
    product.save()
    .then(result => { 
        console.log('Created Product Through Mongoose'); 
        res.redirect('/admin/products');
    })
    .catch(err => { console.log(err) });
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
            product: product
        });
    })
    .catch(err => { console.log(err) });
};

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDescription = req.body.description;
    const updatedPrice = req.body.price;
    Product.findById(prodId).then(product => {
        product.title = updatedTitle;
        product.price = updatedPrice; 
        product.description = updatedDescription; 
        product.imageUrl = updatedImageUrl;
        return product.save()
    })
    .then(result => { 
        console.log("Updated Product"); 
        res.redirect('/admin/products'); 
    })
    .catch(err => { console.log(err) });
};



exports.getProducts = (req, res, next) => {
    Product.find()
    //.select('title price')
    //.populate('userId', 'name')
    .then(Product => {
        res.render('admin/products', {
            prods: Product, 
            pageTitle: 'Admin Products', 
            path: '/admin/products'
        });
    })
    .catch(err => { console.log(err) });
};




/*
the findByIdAndRemove returns the deleted document & findByIdAndDelete does not return. 
If we want the deleted document then we can use findByIdAndRemove otherwise can use findByIdAndDelete.

Recommend:- If don't want to get the deleted document then have to use findByIdAndDelete because it's fast cause does not return the document. 
*/
exports.postDeleteProduct = (req, res, next) => {
   const prodId = req.body.productId;
    Product.findByIdAndRemove(prodId)
    .then(() => {
    res.redirect('/admin/products')
    })
   .catch(err => { console.log(err) });
};

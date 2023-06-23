
const mongodb = require('mongodb');
const Product = require('../models/product');



exports.getAddProduct = (req, res, next) => {

    // sendFile is used to show file
    // Here rootDir is used to show path
    // res.sendFile(path.join(rootDir, 'views', 'addProduct.html'));


    // This is to return view in PUG
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
    const product = new Product(
        title, 
        price, 
        description, 
        imageUrl, 
        null, 
        req.user._id
    );
    product.save()
    .then(result => { 
        console.log('Created Product Through MongoDb'); 
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
    const product = new Product(
        updatedTitle, 
        updatedPrice, 
        updatedDescription, 
        updatedImageUrl, 
        prodId
    );

    product
    .save()
    .then(result => { 
        console.log("Updated Product"); 
        res.redirect('/admin/products'); 
    })
    .catch(err => { console.log(err) });
};



exports.getProducts = (req, res, next) => {
Product.fetchAll()
    .then(Product => {
        res.render('admin/products', {
            prods: Product, 
            pageTitle: 'Admin Products', 
            path: '/admin/products'
        });
    })
    .catch(err => { console.log(err) });
};



exports.postDeleteProduct = (req, res, next) => {
   const prodId = req.body.productId;
    Product.deleteById(prodId)
    .then(() => {
    res.redirect('/admin/products')
    })
   .catch(err => { console.log(err) });
};

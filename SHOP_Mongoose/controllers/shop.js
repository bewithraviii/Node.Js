
// const products = [];
const Product = require('../models/product');


// const { where } = require('sequelize');




exports.getProducts = (req, res, next) => {

    //Showing the Value Stored in Product Array
    // const products = adminData.products;
    Product.fetchAll()
    .then(products => {
        res.render('shop/product-list', {
            prods: products, 
            pageTitle: 'All Products', 
            path: '/products'
        });
    })
    .catch(err => console.log(err));
    

    // sendFile is used to show file
    // Here rootDir is used to show path
    // res.sendFile(path.join(rootDir, 'views', 'shop.html'));                 //This is normal HTML

    // This is to return view in PUG
};


exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
    .then(product => {
        res.render('shop/product-detail', {
            product: product, 
            pageTitle: product.title,
            path: '/products'
        });
    })
    .catch( err => { console.log(err) }); 
};



exports.getIndex = (req, res, next) => {
    Product.fetchAll()
    .then(products => {
        res.render('shop/index', {
            prods: products, 
            pageTitle: 'Shop', 
            path: '/'
        });
    })
    .catch(err => console.log(err));
};


exports.getCart = (req, res, next) => {
    req.user
    .getCart()
    .then(products => {
        res.render('shop/cart', {
            path: '/cart',
            pageTitle: 'Your Cart',
            products: products
        });
    })
    .catch(err => { console.log(err) });
};


exports.postCart = async (req, res, next) => {

    const proId = await req.body.productId;
    Product.findById(proId)
    .then(product => {
        return req.user.addToCart(product);  
    })
    .then(result => { 
        console.log(result) 
        res.redirect('/cart');
    })
    .catch(err => { console.log(err) });
    
};


exports.postcartDeleteItem = async (req, res, next) => {
    const prodId = await req.body.productId;
    req.user.deleteItemFromCart(prodId)
    .then(result => {
        res.redirect('/cart');
    })
    .catch(err => { console.log(err) });
};


exports.postOrder = (req, res, next) => {
    req.user.addOrder()
    .then(result => {
        res.redirect('/orders')
    })
    .catch(err => { console.log(err) });
};




exports.getOrders = (req, res, next) => {
    req.user
    .getOrders()
    .then(orders => {
        res.render('shop/orders', {
            path: '/orders',
            pageTitle: 'Your Orders',
            orders: orders
        });
    })
    .catch(err => { console.log(err) });
};




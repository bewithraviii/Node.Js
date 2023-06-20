
// const products = [];
const Product = require('../models/product');

const Cart = require('../models/cart');




exports.getProducts = (req, res, next) => {

    //Showing the Value Stored in Product Array
    // const products = adminData.products;
    Product.fetchAll(products => {
        res.render('shop/product-list', {
            prods: products, 
            pageTitle: 'All Products', 
            path: '/products'
        });
    });

    // sendFile is used to show file
    // Here rootDir is used to show path
    // res.sendFile(path.join(rootDir, 'views', 'shop.html'));                 //This is normal HTML

    // This is to return view in PUG
};


exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId, product => {
        res.render('shop/product-detail', {
            product: product, 
            pageTitle: product.pageTitle,
            path: '/products'
        });
    });
};



exports.getIndex = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('shop/index', {
            prods: products, 
            pageTitle: 'Shop', 
            path: '/'
        });
    });
};


exports.getCart = (req, res, next) => {
    res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart'

    });
};


exports.postCart = async (req, res, next) => {

    const proId = await req.body.productId;
    console.log(proId);
    Product.findById(proId, product => {
        Cart.addProduct(proId, product.price);
    });
    res.redirect('/cart');
};


exports.getOrders = (req, res, next) => {
    res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders'

    });
};



exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout'

    });
};
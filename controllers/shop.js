
// const products = [];
const Product = require('../models/product');

const Cart = require('../models/cart');
// const { where } = require('sequelize');




exports.getProducts = (req, res, next) => {

    //Showing the Value Stored in Product Array
    // const products = adminData.products;
    Product.findAll()
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
    // Product.findAll({where: { id: prodId }})
    // .then(product => {
    //         res.render('shop/product-detail', {
    //             product: product[0], 
    //             pageTitle: product[0].title,
    //             path: '/products'
    //         });
    //     })
    // .catch(err => { console.log(err) });
    Product.findByPk(prodId)
    .then(product => {
        res.render('shop/product-detail', {
            product: product, 
            pageTitle: product.pageTitle,
            path: '/products'
        });
    })
    .catch( err => { console.log(err) }); 
};



exports.getIndex = (req, res, next) => {
    Product.findAll()
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
    Cart.getProducts(cart => {
        Product.fetchAll(products => {
            const cartProducts = [];
            for (product of products)
            {
                const cartProductData = cart.products.find(prod => prod.id === product.id);
                if(cartProductData) {
                    cartProducts.push({productData: product, qty: cartProductData.qty});
                }
            }
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: cartProducts
            });  
        }); 
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


exports.postcartDeleteItem = async (req, res, next) => {
    const prodId = await req.body.productId;
    Product.findById(prodId, product => {
        Cart.deleteProduct(prodId, product.price);
        res.redirect('/cart');
    });
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
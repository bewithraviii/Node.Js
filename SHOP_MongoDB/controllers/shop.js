
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


// exports.getCart = (req, res, next) => {
//     req.user
//     .getCart()
//     .then(cart => {
//         return cart.getProducts()
//         .then(products => {
//             res.render('shop/cart', {
//                 path: '/cart',
//                 pageTitle: 'Your Cart',
//                 products: products
//             });
//         })
//         .catch(err => { console.log(err) });
//     })
//     .catch(err => { console.log(err) });
//     // Cart.getProducts(cart => {
//     //     Product.fetchAll(products => {
//     //         const cartProducts = [];
//     //         for (product of products)
//     //         {
//     //             const cartProductData = cart.products.find(prod => prod.id === product.id);
//     //             if(cartProductData) {
//     //                 cartProducts.push({productData: product, qty: cartProductData.qty});
//     //             }
//     //         }
//     //         res.render('shop/cart', {
//     //             path: '/cart',
//     //             pageTitle: 'Your Cart',
//     //             products: cartProducts
//     //         });  
//     //     }); 
//     // });
    
// };


exports.postCart = async (req, res, next) => {

    const proId = await req.body.productId;
    Product.findById(proId)
    .then(product => {
        return req.user.addToCart(product);
    })
    .then(result => { console.log(result) })
    .catch(err => { console.log(err) });
    
};


// exports.postcartDeleteItem = async (req, res, next) => {
//     const prodId = await req.body.productId;
//     req.user.getCart()
//     .then(cart => {
//         return cart.getProducts({ where : { id: prodId }})
//     })
//     .then(products => {
//         const product = products[0];
//         return product.CartItem.destroy();
//     })
//     .then(result => {
//         res.redirect('/cart');
//     })
//     .catch(err => { console.log(err) });
//     // Product.findById(prodId, product => {
//     //     Cart.deleteProduct(prodId, product.price); 
//     // });
// };


// exports.postOrder = (req, res, next) => {
//     let fetchedcart;
//     req.user
//     .getCart()
//     .then(cart => {
//         fetchedcart = cart;
//         return cart.getProducts();
//     })
//     .then(products => {
//         return req.user
//         .createOrder()
//         .then(order => {
//             return order.addProducts(products.map(product => {
//                 product.OrderItem = { quantity: product.CartItem.quantity };
//                 return product;
//             }));
//         })
//         .catch(err => { console.log(err) });
//     })
//     .then(result => {
//         return fetchedcart.setProducts(null);
//     })
//     .then(result => {
//         res.redirect('/orders')
//     })
//     .catch(err => { console.log(err) });
// };


// exports.getOrders = (req, res, next) => {
//     req.user
//     .getOrders({include: ['products']})
//     .then(orders => {
//         console.log(orders);
//         res.render('shop/orders', {
//             path: '/orders',
//             pageTitle: 'Your Orders',
//             orders: orders
//         });
//     })
//     .catch(err => { console.log(err) });
// };



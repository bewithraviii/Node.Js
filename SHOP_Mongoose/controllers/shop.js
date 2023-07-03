

const Product = require('../models/product');
const Order = require('../models/order');
const order = require('../models/order');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const product = require('../models/product');


exports.getProducts = (req, res, next) => {
    Product.find()
    .then(products => {
        res.render('shop/product-list', {
            prods: products, 
            pageTitle: 'All Products', 
            path: '/products'
        });
    })
    .catch(err => console.log(err));
    
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

    Product.find()
    .then(products => {
        
        res.render('shop/index', {
            prods: products, 
            pageTitle: 'Shop', 
            path: '/',
            
        });
    })
    .catch(err => console.log(err));
};


exports.getCart = (req, res, next) => {
    req.user
    .populate('cart.items.productId')
    // .execPopulate()
    .then(user => {
        console.log(user.cart.items);
        const products = user.cart.items;
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
    .catch(err => { 
        const error = new Error(err);
        error.httpsStatusCode = 500;
        return next(error); 
    });
    
};


exports.postcartDeleteItem = async (req, res, next) => {
    const prodId = await req.body.productId;
    req.user.removeFromCart(prodId)
    .then(result => {
        res.redirect('/cart');
    })
    .catch(err => { console.log(err) });
};


exports.postOrder = (req, res, next) => {
    req.user
    .populate('cart.items.productId')
    .then(user => {
        const products = user.cart.items.map(i => {
            return { quantity: i.quantity, product: { ...i.productId._doc } };
        });
        const order = new Order({
            user: {
                name: req.user.name,
                email: req.user.email,
                userId: req.user
            },
            products: products
        });
        return order.save();
    })
    .then(result => {
        return req.user.clearCart();
    })
    .then(() => {
        res.redirect('/orders');
    })
    .catch(err => { console.log(err) });
};




exports.getOrders = (req, res, next) => {
    Order.find({"user.userId": req.user._id})
    .then(orders => {
        res.render('shop/orders', {
            path: '/orders',
            pageTitle: 'Your Orders',
            orders: orders

        });
    })
    .catch(err => { console.log(err) });
};



exports.getInvoice = (req, res, next) => {
    const orderId = req.params.orderId;
    Order.findById(orderId)
    .then(order => {
        if(!order)
        {
            return next(new Error('No order found'));
        }
        if (order.user.userId.toString() !== req.user._id.toString())
        {
            return next(new Error('Unauthorized'));
        }
        const invoiceName = 'invoice-' + orderId + '.pdf';
        const invoicePath = path.join('data', 'invoices', invoiceName);

        const pdfDoc = new PDFDocument();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename:"'+invoiceName+'"');
        pdfDoc.pipe(fs.createWriteStream(invoicePath));
        pdfDoc.pipe(res);

        pdfDoc.text('Invoice');
        pdfDoc.text('------------------------------------------------------------------------------');
        pdfDoc.text('Your order-Id:'+ orderId);
        let totalprice = 0;
        order.products.forEach(prod=> {
            totalprice += prod.quantity * prod.product.price;
            pdfDoc.text('Name: '+ prod.product.title + ' , ' + 'Quantity: '+prod.quantity + ' , ' + 'Price: '+ prod.product.price + 'x' +  prod.quantity+' , ' + 'Sum = '+ (prod.product.price * prod.quantity))
        });
        pdfDoc.text('Total price: '+ totalprice);

        pdfDoc.end();
        // fs.readFile(invoicePath, (err, data) => {
        // if(err)
        // {
        //     return next(err);
        // }
        // res.setHeader('Content-Type', 'application/pdf');
        // res.setHeader('Content-Disposition', 'inline; filename:"'+invoiceName+'"');
        // res.send(data);
        // })
        // const file = fs.createReadStream(invoicePath);
        // res.setHeader('Content-Type', 'application/pdf');
        // res.setHeader('Content-Disposition', 'inline; filename:"'+invoiceName+'"');
        // file.pipe(res);
    })
    .catch(err => next(err));
    
}
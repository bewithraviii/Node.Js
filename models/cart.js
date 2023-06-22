
// const fs = require('fs');
// const path = require('path');

// const p = path.join(__dirname, '../', 'data', 'cart.json');

// module.exports = class Cart{
   
//     static addProduct(id, productprice) {
//         fs.readFile(p, (err, fileContent) => {
//             let cart = {products: [], totalprice: 0};

//             if(!err)
//             {
//                 cart = JSON.parse(fileContent);
//             }

//             const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
//             const existingProduct = cart.products[existingProductIndex];
//             let updatedProduct;
            
//             if (existingProduct) 
//             {
//                 updatedProduct = {...existingProduct};
//                 updatedProduct.qty = updatedProduct.qty + 1; 
//                 cart.products = [...cart.products];
//                 cart.products[existingProductIndex] = updatedProduct; 
//             }
//             else
//             {
//                 updatedProduct = { id: id , qty: 1 };
//                 cart.products = [...cart.products, updatedProduct];
//             }

//             cart.totalprice = cart.totalprice + +productprice;
//             fs.writeFile(p, JSON.stringify(cart), (err) => {
//                 console.log(err);
//             });
//         });
//     }

//     static deleteProduct(id, productPrice)
//     {
//         fs.readFile(p, (err, fileContent) => {
//             if(err)
//             {
//                 return;
//             }
//             const updatedCart = {...JSON.parse(fileContent)};
//             const product = updatedCart.products.find(prod => prod.id === id);
//             if(!product)
//             {
//                 return;
//             }
//             const productQty = product.qty;
//             updatedCart.products = updatedCart.products.filter(prod => prod.id !== id);
//             updatedCart.totalprice = updatedCart.totalprice - productPrice * productQty;
//             fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
//                 console.log(err);
//             }); 
//         });
//     }

//     static getProducts(cb){
//         fs.readFile(p, (err, fileContent) => {
//             const cart = JSON.parse(fileContent);
//             if(err){
//                 cb(null);
//             }
//             else{
//                 cb(cart);
//             }
//         });
//     }

// }


const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Cart = sequelize.define('Cart' , {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    }
});


module.exports = Cart;
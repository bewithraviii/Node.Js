// const db = require('../util/database');

// const products = [];

// const fs = require('fs');
// const path = require('path');

// const cart = require('./cart');


// const p = path.join(__dirname, '../', 'data', 'product.json');


// const getProductFromFile = cb => {
//       fs.readFile(p, (err, fileContent) => {
//           if(err) {
//               cb([]);
//           }
//           else{
//               cb(JSON.parse(fileContent));
//           }
//       });
// }

// module.exports = class Product{
//     constructor(id, title, imageUrl, description, price){
//         this.id = id;
//         this.title = title;
//         this.imageUrl = imageUrl;
//         this.description = description;
//         this.price = price;
//     }

    // For Static Data
    // save()
    // {
        
    //     // products.push(this);
    //     // const p = path.join(__dirname, '../', 'data', 'product.json');
    //     // fs.readFile(p, (err, fileContent) => {
    //     //     let products = [];
    //     //     if(!err)
    //     //     {
    //     //         products = JSON.parse(fileContent);
    //     //     }
    //     // });

    //     getProductFromFile(products => {
    //         if(this.id)
    //         {
    //             const existingProductIndex = products.findIndex(
    //                 prod => prod.id === this.id
    //             );
    //             const updatedProducts = [...products];
    //             updatedProducts[existingProductIndex] = this;
    //             fs.writeFile(p, JSON.stringify(updatedProducts), err => {
    //                 console.log(err);
    //             });
    //         }
    //         else
    //         {
    //             this.id = Math.random().toString();
    //             products.push(this);
    //             fs.writeFile(p, JSON.stringify(products), err => {
    //                 console.log(err);
    //             });
    //         }
    //     })
    // }


    // static deleteById(id)
    // {
    //     // const p = path.join(__dirname, '../', 'data', 'product.json');
    //     getProductFromFile(products => {
    //         const product = products.find(prod => prod.id === id);
    //         const updatedProducts = products.filter(prod => prod.id !== id);            
    //         fs.writeFile(p, JSON.stringify(updatedProducts), err => {
    //             if(!err)
    //             {
    //                 cart.deleteProduct(id, product.price);
    //             }
    //         });
    //     })
    // }


    // static fetchAll(cb) {
    //     getProductFromFile(cb)
    // }

    // static findById(id, cb) {
    //     getProductFromFile(products => {
    //         const product = products.find(p => p.id === id);
    //         cb(product);
    //     });
    // }





    // For Database Data MySQL
    // save() {
    //    return db.execute('INSERT INTO products (title, price, imageUrl, description) VALUES (?, ?, ?, ?)',
    //     [this.title, this.price, this.imageUrl, this.description]
    //     );
    // }

    // static deleteById(id) {

    // }

    // static fetchAll() {
    //     return db.execute('SELECT * FROM products');
    // }

    // static findById(id) {
    //    return db.execute('SELECT * FROM products WHERE products.id = ?', [id]);
    // }

// };




// Using Sequelize for Data
const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Product = sequelize.define('product', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING
    },
    price: {
        type: Sequelize.DOUBLE,
        allowNull: false
    },
    imageUrl: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false
    }
});



module.exports = Product;
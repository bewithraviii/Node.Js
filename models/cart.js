
const fs = require('fs');
const path = require('path');

const p = path.join(__dirname, '../', 'data', 'cart.json');

module.exports = class Cart{
   
    static addProduct(id, productprice) {
        fs.readFile(p, (err, fileContent) => {
            let cart = {products: [], totalprice: 0};

            if(!err)
            {
                cart = JSON.parse(fileContent);
            }

            const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct;
            
            if (existingProduct) 
            {
                updatedProduct = {...existingProduct};
                updatedProduct.qty = updatedProduct.qty + 1; 
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProduct; 
            }
            else
            {
                updatedProduct = { id: id , qty: 1 };
                cart.products = [...cart.products, updatedProduct];
            }

            cart.totalprice = cart.totalprice + +productprice;
            fs.writeFile(p, JSON.stringify(cart), (err) => {
                console.log(err);
            });
        });
    }



}
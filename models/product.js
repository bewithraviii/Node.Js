// const products = [];

const fs = require('fs');
const path = require('path');

const getProductFromFile = (cb) => {
    const p = path.join(__dirname, '../', 'data', 'product.json');
      fs.readFile(p, (err, fileContent) => {
          if(err) {
              cb([]);
          }
          else{
              cb(JSON.parse(fileContent));
          }
      });
}

module.exports = class Product{
    constructor(id, title, imageUrl, description, price){
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save()
    {
        
        // products.push(this);
        const p = path.join(__dirname, '../', 'data', 'product.json');
        fs.readFile(p, (err, fileContent) => {
            
            let products = [];

            if(!err)
            {
                products = JSON.parse(fileContent);
            }
            if(this.id)
            {
                const existingProductIndex = products.findIndex(
                    prod => prod.id === this.id
                );
                const updatedProducts = [...products];
                updatedProducts[existingProductIndex] = this;
                fs.writeFile(p, JSON.stringify(updatedProducts), err => {
                    console.log(err);
                });
            }
            else
            {
                this.id = Math.random().toString();

                products.push(this);
                fs.writeFile(p, JSON.stringify(products), err => {
                    console.log(err);
                });
            }
        });

    }

    static fetchAll(cb) {
        getProductFromFile(cb)
    }

    static findById(id, cb) {
        getProductFromFile(products => {
            const product = products.find(p => p.id === id);
            cb(product);
        });
    }

};
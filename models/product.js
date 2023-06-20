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
    constructor(t){
        this.title = t;
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

            products.push(this);
            fs.writeFile(p, JSON.stringify(products), (err) => {
                console.log(err);
            });
        });

    }

    static fetchAll(cb) {
        getProductFromFile(cb)
    }

};
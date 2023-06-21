
const Product = require('../models/product');


exports.getAddProduct = (req, res, next) => {

    // sendFile is used to show file
    // Here rootDir is used to show path
    // res.sendFile(path.join(rootDir, 'views', 'addProduct.html'));


    // This is to return view in PUG
    res.render('admin/editProduct', {
    pageTitle: 'Add Product', 
    path: '/admin/addProduct', 
    editing: false
    });
};



exports.postAddProduct = (req, res, next) => {
    // console.log(req.body);
    // products.push({ title: req.body.title });
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    // const product = new Product(null, title, imageUrl, description, price);
    // product.save()
    // .then(() => { res.redirect('/'); })
    // .catch(err => console.log(err));
    Product.create({
        title: title,
        price: price,
        imageUrl: imageUrl,
        description: description
    })
    .then(result => { console.log('Created Product Through Sequelize') })
    .catch(err => { console.log(err) });
};


exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if(!editMode){
        return res.redirect('/');
    }
    const proId = req.params.productId;
    Product.findById(proId, product => {
        if(!product){
            return res.redirect('/');
        }
        res.render('admin/editProduct', {
            pageTitle: 'Edit Product', 
            path: '/admin/editProduct',
            editing: editMode,
            product: product
        });
    });
};

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;

    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDescription = req.body.description;
    const updatedPrice = req.body.price;
    const updatedProduct = new Product(prodId, updatedTitle, updatedImageUrl, updatedDescription, updatedPrice);
    updatedProduct.save();
    res.redirect('/admin/products');
};



exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('admin/products', {
            prods: products, 
            pageTitle: 'Admin Products', 
            path: '/admin/products'
        });
    });
};



exports.postDeleteProduct = (req, res, next) => {
   const prodId = req.body.productId;
   Product.deleteById(prodId);
   res.redirect('/admin/products')
};
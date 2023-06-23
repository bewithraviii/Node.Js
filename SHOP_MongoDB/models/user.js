
const getdb = require('../util/database').getDb;
const mongodb = require('mongodb');

const ObjectId = mongodb.ObjectId;


class User {
    constructor(username, email, cart, _id) {
        this.name = username;
        this.email = email;
        this.cart = cart;       // {items: []}
        this._id = _id;
    }


    save() {
        const db = getdb();
        return db.collection('users').insertOne(this);
    }


    addToCart(product) {
        // const cartProduct = this.cart.items.findIndex(cp => {
        //     return cp._id === product._id;
        // });

        const updatedCart = {items: [{ productId: new ObjectId(product._id), quantity: 1 }] };
        const db = getdb();
        return db.collection('user')
        .updateOne(
            { _id: new ObjectId(this._id) },
            { $set: {cart: updatedCart} }
        );

    }


    static findById(userId) {
        const db = getdb();
        return db.collection('users')
        .findOne({ _id: new  ObjectId(userId)})
        .then(user => {
            console.log(user);
            return user;
        })
        .catch(err => { console.log(err) })
    }



}



module.exports = User;


const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {

    // Adding Connection string to our application
    MongoClient.connect('mongodb+srv://ravipateljigneshpatel137:Ravi3601@nodeshop.azir75m.mongodb.net/Shop')
    .then(client => {
        console.log('Connected');
        _db = client.db()
        callback();
    })
    .catch(err => { 
        console.log(err); 
        throw err;
    });

};

const getDb = () => {
    if(_db) {
        return _db;
    }
    throw 'No Database Found';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
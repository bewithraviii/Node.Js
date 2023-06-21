// const mysql = require('mysql2');

// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     database: 'nodecomplete',
//     password: 'root'
// });

// module.exports = pool.promise();

const Sequelize = require('sequelize');

// 1. DB Name, 2. username, 3. password, 4. object
const sequelize = new Sequelize('nodecomplete', 'root', 'root', {
    dialect: 'mysql', 
    host: 'localhost'
});


module.exports = sequelize;
var mysql = require('mysql');

require('dotenv').config();

var connection = mysql.createConnection({
        host: process.env.HOST,
        username: process.env.NAME,
        password: process.env.PASSWORD,
        database: 'registration'
});


connection.connect();
//проверить есть ли база



module.exports = connection;

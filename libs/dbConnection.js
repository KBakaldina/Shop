var mysql = require('mysql');

require('dotenv').config();

var connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
});

//TODO: add async await promise

connection.connect( (err) => {
        if (err) console.log(err);
        else {
                console.log('DB connected');
                connection.query('CREATE DATABASE IF NOT EXISTS registration', (err) => {
                        if (err) console.log(err);
                        console.log('DB registration created');
                });
                connection.query('USE registration', (err) =>{
                        if (err) console.log(err);
                });
                connection.query('CREATE TABLE IF NOT EXISTS users (' +
                            'id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY, ' +
                            'userName VARCHAR(20) UNIQUE KEY NOT NULL, ' +
                            'password VARCHAR(100) NOT NULL)', (err) =>{
                                if (err) console.log(err);
                                else console.log('Table users created');
                });
        }
});

module.exports = connection;

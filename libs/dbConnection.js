const mysql = require('mysql');

require('dotenv').config();

const connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
});

connection.connect( (err) => {
        if (err) console.log(err);
        else {
                connection.query('CREATE DATABASE IF NOT EXISTS registration', (err) => {
                        if (err) console.log(err);
                });
                connection.query('USE registration', (err) =>{
                        if (err) console.log(err);
                });
                connection.query('CREATE TABLE IF NOT EXISTS users (' +
                            'id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY, ' +
                            'userName VARCHAR(20) UNIQUE KEY NOT NULL, ' +
                            'password VARCHAR(100) NOT NULL)', (err) =>{
                                if (err) console.log(err);
                });
        }
});

const queryPromise = (query, data) => {
        return  new Promise ((resolve,reject)=>{
                connection.query(query, data, (err, result) => {
                        if (err) return reject(err);
                        return resolve(result);
                });
        });
};

module.exports = {connection, queryPromise};

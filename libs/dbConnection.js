const mysql = require('mysql');

require('dotenv').config();

const connection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

//TODO: what to do with console.log?
connection.getConnection( (err) => {
    if (err) console.log(err);
    else {
        connection.query('CREATE TABLE IF NOT EXISTS users (' +
            'id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY, ' +
            'userName VARCHAR(20) UNIQUE KEY NOT NULL, ' +
            'password VARCHAR(100), ' +
            'email VARCHAR(100) UNIQUE KEY)', (err) => {
            if (err) console.log(err);
        });

        connection.query('CREATE TABLE IF NOT EXISTS products (' +
            'id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY, ' +
            'productName VARCHAR(25) NOT NULL, ' +
            'price DECIMAL(9,2) NOT NULL, ' +
            'description VARCHAR(150) NOT NULL, ' +
            'pictureLink VARCHAR(150), ' +
            'userId INT(10) UNSIGNED NOT NULL, ' +
            'CONSTRAINT FK_products_userId FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE)', (err) => {
            if (err) console.log(err);
        });

        connection.query('CREATE TABLE IF NOT EXISTS likes (' +
            'productId INT(10) UNSIGNED NOT NULL,' +
            'CONSTRAINT FK_likes_productId FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE, ' +
            'userId INT(10) UNSIGNED NOT NULL, ' +
            'CONSTRAINT FK_likes_userId FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE, '+
            'PRIMARY KEY (productId, userId))', (err) => {
            if (err) console.log(err);
        });

        connection.query('CREATE TABLE IF NOT EXISTS tokens (' +
            'userId INT(10) UNSIGNED NOT NULL, ' +
            'token VARCHAR(500) NOT NULL, ' +
            'CONSTRAINT FK_tokens_userId FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE)', (err) => {
            if (err) console.log(err);
        });

        connection.query('CREATE TABLE IF NOT EXISTS facebook (' +
            'fbId BIGINT(40) UNSIGNED NOT NULL PRIMARY KEY, ' +
            'userId INT(10) UNSIGNED NOT NULL, ' +
            'token VARCHAR(500) NOT NULL, ' +
            'CONSTRAINT FK_facebook_userId FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE)', (err) => {
            if (err) console.log(err);
        });

        connection.query('DROP TABLE IF EXISTS chat', (err) => {
            if (err) console.log(err);
        });

        connection.query('CREATE TABLE IF NOT EXISTS chat (' +
            'id VARCHAR(40) NOT NULL, ' +
            'name VARCHAR(100) NOT NULL)', (err) => {
            if (err) console.log(err);
        });
    }
});

const queryPromise = (query, data) => {
    return new Promise ((resolve,reject) => {
        connection.query(query, data, (err, result) => {
            if (err) return reject(err);
            else return resolve(result);
        });
    });
};

module.exports = {connection, queryPromise};

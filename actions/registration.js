var connection = require('../libs/dbConnection');

module.exports = function (userName, userPassword) {
    var sql='INSERT INTO users(login, password) VALUES (?, ?)';
    var data=[userName, userPassword];
            connection.query(
                sql, data,
                function (err, res) {
                   if (err) console.log(err);
                });
    };
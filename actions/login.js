var connection = require('../libs/dbConnection');
var bcrypt = require('bcrypt');

module.exports = function (userName, userPassword, callback) {
    var sql = 'SELECT * FROM users WHERE login = ?';

    connection.query(
        sql, userName,
        function (err, rows) {
            if (err) callback(1, err);

            if (rows[0]){
                if (bcrypt.compareSync(userPassword, rows[0].password))
                    callback(0, 'You logged in successfully!');
                else callback(0, 'Wrong password. Try again, please!');
            }
            else callback(0, 'Wrong login name. Please, try again or sign up!')
        });
};
var connection = require('../libs/dbConnection');

module.exports = function (userName, userPassword, callback) {
    var sql='SELECT * FROM users WHERE login = ?';
    connection.query(
        sql, userName,
        function (err, rows) {
            if (err) {
                callback(0, 'Some errors... Please, try again later! :C ')
            }
            console.log(rows[0]);
            if (rows[0]){
                console.log('nonono');
                if (userPassword === rows[0].password)
                    callback(0, 'You logged in successfully!');
                callback(0, 'Wrong password. Try again, please!');
            }
            else callback(0, 'Wrong login name. Please, try again or sign up!')
        });
};
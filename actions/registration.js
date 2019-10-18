var connection = require('../libs/dbConnection');
var bcrypt = require('bcrypt');

module.exports = function (userName, userPassword, userPassword2, callback) {
    if(userName && userPassword && userPassword2){
        var sqlUserExist='SELECT * FROM users WHERE userName = ?';
        var sqlCreateNewUser='INSERT INTO users(userName, password) VALUES (?, ?)';

        connection.query(
            sqlUserExist, userName, function (err, rows) {
                if (err) callback(1, err);

                if (!rows[0]) {
                    if(userPassword == userPassword2){
                        userPassword = bcrypt.hashSync(userPassword, 5);

                        connection.query(
                            sqlCreateNewUser, [userName, userPassword],
                            function (err) {
                                if (err) callback(1, err);
                                else callback(0, 'Thank you for registration!');
                            });
                    } else callback(0, 'Incorrect conformation of password. Try again, please!');
                } else callback(0, 'This user is already exists. Please, choose another name and try again!')
            });
    } else callback(0, 'All fields (\"Name\", \"Create password\", \"Confirm password\") are required. Please, try again by completing them!')
};
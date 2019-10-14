var connection = require('../libs/dbConnection');

module.exports = function (userName, userPassword, userPassword2, callback) {
    var sqlUserExist='SELECT * FROM users WHERE login = ?';
    var sqlCreateNewUser='INSERT INTO users(login, password) VALUES (?, ?)';

    connection.query(
        sqlUserExist, userName, function (err, rows) {
            if (err) callback(1, err);

            if (!rows[0]) {
                if(userPassword === userPassword2){
                    connection.query(
                        sqlCreateNewUser, [userName, userPassword],
                        function (err) {
                            if (err) callback(1, err);
                            else callback(0, 'Thank you for registration!');
                        });
                } else callback(0, 'Incorrect conformation of password. Try again, please!');
            } else callback(0, 'This user is already exists. Please, choose another name and try again!')
        });
    };
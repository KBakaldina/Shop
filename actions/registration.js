const connection = require('../libs/dbConnection');
const bcrypt = require('bcrypt');

module.exports = async  (userName, userPassword, userPassword2, done) => {
    if(userName && userPassword && userPassword2){
        const sqlUserExist='SELECT * FROM users WHERE userName = ?';
        const sqlCreateNewUser='INSERT INTO users(userName, password) VALUES (?, ?)';

        await connection.query(
            sqlUserExist, userName, async(err, rows) => {
                if (err) done(1, err);

                if (!rows[0]) {
                    if(userPassword == userPassword2){
                        userPassword = bcrypt.hashSync(userPassword, 5);

                        await connection.query(
                            sqlCreateNewUser, [userName, userPassword],
                            (err) => {
                                if (err) done(1, err);
                                else done(0, 'Thank you for registration! Now log in, please.');
                            });
                    } else done(0, 'Incorrect conformation of password. Try again, please!');
                } else done(0, 'This user is already exists. Please, choose another name and try again!')
            });
    } else done(0, 'All fields (\"Name\", \"Create password\", \"Confirm password\") are required. Please, try again by completing them!')
};
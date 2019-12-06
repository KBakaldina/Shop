const bcrypt = require('bcrypt');
const queryPromise = require('../libs/dbConnection').queryPromise;
const actionCreateError = require('../actions/createError');

module.exports = async (userName, email, userPassword, userPassword2, pictureLink) => {
    //check if userName exists in the database
    let rowsSearchForUserName = await queryPromise('SELECT * FROM users WHERE userName = ?', userName);
    if (rowsSearchForUserName[0])
        throw actionCreateError(400, 'This user already exists.',
            'Please, choose another name and try again!');

    //check if email exists in the database
    let rowsSearchForEmail = await queryPromise(
        'SELECT * FROM users WHERE email = ?',
        [email]);
    if (rowsSearchForEmail[0])
        throw actionCreateError(400, 'This email is already in use.',
            'Choose another email and try again or login!');

    //check if password is equal to password conformation
    if(userPassword !== userPassword2)
        throw actionCreateError(400, 'Incorrect conformation of password.',
            'Try again, please!');

    //hash password and insert into the database
    userPassword = bcrypt.hashSync(userPassword, parseInt(process.env.HASH_SALT));
    let rowsInsertUser = await queryPromise(
        'INSERT INTO users(userName, password, email, pictureLink) VALUES (?, ?, ?, ?)',
        [userName, userPassword, email, pictureLink]);

    return {id: rowsInsertUser.insertId};
};
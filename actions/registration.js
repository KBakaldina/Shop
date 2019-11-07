const bcrypt = require('bcrypt');
const queryPromise = require('../libs/dbConnection').queryPromise;

module.exports = async  (userName, userPassword, userPassword2) => {
    let rows = await queryPromise('SELECT * FROM users WHERE userName = ?', userName);

    if (!rows[0]) {
        if(userPassword == userPassword2){
            userPassword = bcrypt.hashSync(userPassword, 5);

            await queryPromise(
                'INSERT INTO users(userName, password) VALUES (?, ?)',
                [userName, userPassword]);

            rows = await queryPromise(
                'SELECT * FROM users WHERE userName = ?',
                userName);

            return {id: rows[0].id, msg: 'Success'};
        } return {id: false, msg: 'Incorrect conformation of password. Try again, please!'};
    } else return {id: false, msg: 'This user is already exists. Please, choose another name and try again!'};
};
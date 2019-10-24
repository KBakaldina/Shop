const bcrypt = require('bcrypt');
const queryPromise = require('../libs/dbConnection').queryPromise;

module.exports = async  (userName, userPassword, userPassword2) => {
    try{
        let rows = await queryPromise('SELECT * FROM users WHERE userName = ?', userName);

         if (!rows[0]) {
             if(userPassword == userPassword2){
                 userPassword = bcrypt.hashSync(userPassword, 5);

                 try {
                     await queryPromise('INSERT INTO users(userName, password) VALUES (?, ?)', [userName, userPassword]);
                     return 'Thank you for registration! Now log in, please.';
                 } catch(err){ throw err; }

             } return 'Incorrect conformation of password. Try again, please!';
         } else return 'This user is already exists. Please, choose another name and try again!';

         } catch(err) { throw err; }
};
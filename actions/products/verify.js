const queryPromise = require('../../libs/dbConnection').queryPromise;

module.exports = async (id, userId) => {
    try {
         let rows = await queryPromise('SELECT * FROM products WHERE id=? AND userId=?',[id, userId]);
         return rows[0];
    } catch(err) { throw err; }
};
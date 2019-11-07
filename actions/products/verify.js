const queryPromise = require('../../libs/dbConnection').queryPromise;

module.exports = async (id, userId) => {
    let rows = await queryPromise(
        'SELECT * FROM products WHERE id=? AND userId=?',
        [id, userId]);
    return rows[0];
};
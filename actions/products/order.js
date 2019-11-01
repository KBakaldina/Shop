const queryPromise = require('../../libs/dbConnection').queryPromise;

module.exports = async(userId, order, desc) => {
    try{
        let rows;

        if (desc) {
            rows = await queryPromise(
                'SELECT * FROM products WHERE userId=? ORDER BY ' + order + ' DESC',
                userId);
        } else {
            rows = await queryPromise(
                'SELECT * FROM products WHERE userId=? ORDER BY ' + order,
                userId);
        }

        return rows;
    } catch(err) { throw err; }
};
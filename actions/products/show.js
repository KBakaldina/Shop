const queryPromise = require('../../libs/dbConnection').queryPromise;

module.exports = async(userId, order, desc, search) => {
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

        if (search) {
            let pattern = '%' + search + '%';
            rows = await queryPromise(
                'SELECT * FROM products WHERE userId=? AND (productName like ? OR description LIKE ?)',
                [userId, pattern, pattern]);
        }

        return rows;
    } catch(err) { throw err; }
};
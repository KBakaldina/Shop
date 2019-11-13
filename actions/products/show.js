const queryPromise = require('../../libs/dbConnection').queryPromise;

module.exports = async(userId, order, desc, search, limit, page) => {
    limit = parseInt(limit);
    search = '%'+search+'%';
    let offset = (page - 1) * limit;

    let sqlCount='SELECT COUNT(id) AS total FROM products WHERE products.userId=? AND (productName like ? OR description LIKE ?)';

    let countRows = await queryPromise(sqlCount, [userId, search, search]);
    let count = Math.ceil(countRows[0].total/limit);

    let sqlLimit = sqlCount
        .replace('COUNT(id) AS total FROM products',
                    'products.*, COUNT(likes.productID) AS likes FROM products ' +
                    'LEFT JOIN likes ON likes.productId=products.id');

    sqlLimit += ` GROUP BY products.id ORDER BY ${order}`;

    if (desc == true || desc == 'true') sqlLimit += ' DESC';
    sqlLimit += ' LIMIT ? OFFSET ?';

    let rows = await queryPromise(sqlLimit, [userId, search, search, limit, offset]);

    return {rows: rows, count: count};
};
const queryPromise = require('../../libs/dbConnection').queryPromise;

module.exports = async(userId, order, desc, search, limit, fav, page) => {
    limit = parseInt(limit);
    search = '%'+search+'%';
    let offset = (page - 1) * limit;

    let sqlCount='SELECT COUNT(id) AS total FROM products';
    if (fav == 'true' || fav == true) sqlCount += ', likes';
    sqlCount += ' WHERE';
    if (fav == 'true' || fav == true) sqlCount += ` (likes.productId=products.id AND likes.userId=${userId}) AND`;
    sqlCount += ` (productName like ? OR description LIKE ?)`;

    let countRows = await queryPromise(sqlCount, [search, search]);
    let count = Math.ceil(countRows[0].total/limit);

    let sqlLimit = sqlCount
        .replace('COUNT(id) AS total FROM products',
        'products.*, COUNT(likes.productID) AS likes FROM products ' +
                    'LEFT JOIN likes ON likes.productId=products.id')
        .replace(', likes','');

    sqlLimit += ` GROUP BY products.id ORDER BY ${order}`;

    if (desc == true || desc == 'true') sqlLimit += ' DESC';
    sqlLimit += ' LIMIT ? OFFSET ?';

    let rows = await queryPromise(sqlLimit, [search, search, limit, offset]);

    let rowsIsLiked = await queryPromise('SELECT productId FROM likes WHERE userId=?', [userId]);

    for (let i=0; rows[i]; ++i)
        for (let j=0; rowsIsLiked[j]; ++j)
            if (rows[i].id == rowsIsLiked[j].productId)
                rows[i].liked = true;

    return {rows: rows, count: count};
};
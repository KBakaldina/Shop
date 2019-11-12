const queryPromise = require('../../libs/dbConnection').queryPromise;

module.exports = async(userId, order, desc, search, limit, fav, page) => {
    limit = parseInt(limit);
    search = '%'+search+'%';
    let offset = (page - 1) * limit;

    let sqlCount='SELECT COUNT(id) FROM products';
    if (fav == 'true' || fav == true) sqlCount += ', likes';
    sqlCount +=' WHERE';
    if (fav == 'true' || fav == true) sqlCount += ' (likes.productId=products.id AND likes.userId=' + userId + ') AND';
    sqlCount += ' (productName like ? OR description LIKE ?)';

    let countRows = await queryPromise(sqlCount, [search, search]);
    let count = Math.ceil(countRows[0]['COUNT(id)']/limit);

    let sqlLimit = sqlCount.replace('COUNT(id)',
                   '*, (SELECT COUNT(productId) FROM likes WHERE likes.productId=products.id) as likes,'+
                   ' (SELECT COUNT(productId) FROM likes WHERE likes.productId=products.id AND likes.userId=?) AS liked');
    sqlLimit += ' ORDER BY ' + order;

    if (desc == true || desc == 'true') sqlLimit += ' DESC';
    sqlLimit += ' LIMIT ? OFFSET ?';

    let rows = await queryPromise(sqlLimit, [userId, search, search, limit, offset]);

    return {rows: rows, count: count};
};
const queryPromise = require('../../libs/dbConnection').queryPromise;

module.exports = async(userId, order, desc, search, limit, page, mode) => {
    limit = parseInt(limit);
    let offset = (page - 1) * limit;
    let likes;

    let sql='SELECT COUNT(id) FROM products';
    if (mode == 'favorites') sql += ',likes';
    if (mode!='shop' || search) sql +=' WHERE';
    if (mode=='user\'s') sql += ' products.userId=' + userId;
    if (mode=='favorites') sql += ' likes.productId=products.id AND likes.userId=' + userId;
    if (mode!='shop' && search) sql += ' AND';
    if (search) sql += ' (productName like \'%'+search+'%\' OR description LIKE \'%'+search+'%\')';
    let countRows = await queryPromise(sql, userId);
    let count = Math.ceil(countRows[0]['COUNT(id)']/limit);

    let sqlLimit = sql.replace('COUNT(id)',
                   '*, (SELECT COUNT(productId) FROM likes WHERE likes.productId=products.id) as likes,'+
                   ' (SELECT COUNT(productId) FROM likes WHERE likes.productId=products.id AND likes.userId=?) AS liked');

    sqlLimit += ' ORDER BY ' + order;
    if (desc == true || desc == 'true') sqlLimit += ' DESC';
    sqlLimit += ' LIMIT ? OFFSET ?';

    let rows = await queryPromise(sqlLimit, [userId, limit, offset]);

    return {rows: rows, count: count};
};
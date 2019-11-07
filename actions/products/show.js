const queryPromise = require('../../libs/dbConnection').queryPromise;

module.exports = async(userId, order, desc, search, page) => {
    let limit = 3;
    let offset = (page - 1) * limit;

    let sql='SELECT * FROM products WHERE userId=?'
    if (search) sql += ' AND (productName like \'%'+search+'%\' OR description LIKE \'%'+search+'%\')';
    sql += ' ORDER BY ' + order;
    if (desc == true || desc == 'true') sql += ' DESC';

    let sqlLimit = sql + ' LIMIT ? OFFSET ?';
    let rows = await queryPromise( sqlLimit,[userId, limit, offset]);

    let sqlCount = sql.replace('*', 'COUNT(id)');
    let countRows = await queryPromise(sqlCount, userId);
    let count = Math.ceil(countRows[0]['COUNT(id)']/limit);

    return {rows: rows, count: count, limit: limit};
};
const queryPromise = require('../../libs/dbConnection').queryPromise;

module.exports = async(isLimited, userId, order, desc, search, page) => {
    try{
        let limit = 3;

        let sql='SELECT * FROM products WHERE userId=?'
        if (search) sql += ' AND (productName like \'%'+search+'%\' OR description LIKE \'%'+search+'%\')';
        sql += ' ORDER BY ' + order;
        if (desc == true || desc == 'true') sql += ' DESC';

        if (isLimited){
            sql += ' LIMIT ? OFFSET ?';
            let offset = (page - 1) * limit;
            let rows = await queryPromise( sql,[userId, limit, offset]);
            return rows;
        } else {
            sql = sql.replace('*', 'COUNT(id)');
            let rows = await queryPromise(sql, userId);
            let count = rows[0]['COUNT(id)'];
            return Math.ceil(count/limit);
        }
    } catch(err) { throw err; }
};
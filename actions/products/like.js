const queryPromise = require('../../libs/dbConnection').queryPromise;

module.exports = async (userId, productId) => {
    let sql = 'SELECT * from likes WHERE productId=? AND userId=?';
    let sqlLike = 'INSERT INTO likes(productId, userId) VALUES(?, ?)';
    let sqlDislike = 'DELETE FROM likes WHERE productId=? AND userId=?';

    let rows = await queryPromise(sql, [productId, userId]);

    if (rows[0]) await queryPromise(sqlDislike, [productId, userId]);
    else await queryPromise(sqlLike, [productId, userId]);
};
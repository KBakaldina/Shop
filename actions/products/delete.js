const queryPromise = require('../../libs/dbConnection').queryPromise;

module.exports = async  (productIdToDelete) => {
    try{
        await queryPromise(
            'DELETE FROM products WHERE id=?',
            [productIdToDelete]);
        return;
    } catch(err) { throw err; }
};
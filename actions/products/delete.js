const queryPromise = require('../../libs/dbConnection').queryPromise;
var fs = require('fs');

module.exports = async  (productIdToDelete) => {
    let rows = await queryPromise(
        'SELECT * FROM products WHERE id=?',
        [productIdToDelete]);

    fs.unlink(`public${rows[0].pictureLink}`, async() => {
        await queryPromise(
            'DELETE FROM products WHERE id=?',
            [productIdToDelete]);
        return;
    });
};
const queryPromise = require('../../libs/dbConnection').queryPromise;
var fs = require('fs');

module.exports = async  (productIdToDelete) => {
    try{
        let rows = await queryPromise(
        'SELECT * FROM products WHERE id=?',
        [productIdToDelete]);
        let pictureLink = rows[0].pictureLink.substring(1);
        fs.unlinkSync(pictureLink);

        await queryPromise(
            'DELETE FROM products WHERE id=?',
            [productIdToDelete]);
        return;
    } catch(err) { console.log(err); throw err; }
};
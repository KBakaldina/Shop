const queryPromise = require('../../libs/dbConnection').queryPromise;
var fs = require('fs');

module.exports = async  (id, productName, price, description, pictureLink) => {
    if (pictureLink) {
            let rows = await queryPromise(
                'SELECT * FROM products WHERE id=?',
                [id]);
            fs.unlinkSync('public'+rows[0].pictureLink);

            await queryPromise(
                'UPDATE products SET productName=?, price=?, description=?, pictureLink=? WHERE id=?',
                [productName, parseFloat(price), description, '/'+pictureLink.substring(7), id]);
    } else await queryPromise(
        'UPDATE products SET productName=?, price=?, description=? WHERE id=?',
        [productName, price, description, id]);
    return;
};
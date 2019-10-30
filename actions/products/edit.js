const queryPromise = require('../../libs/dbConnection').queryPromise;
var fs = require('fs');

module.exports = async  (id, productName, description, pictureLink) => {
    try{
        if (pictureLink)
        {
            let rows = await queryPromise(
                'SELECT * FROM products WHERE id=?',
                [id]);
            fs.unlinkSync('public'+rows[0].pictureLink);

            await queryPromise(
                'UPDATE products SET productName=?, description=?, pictureLink=? WHERE id=?',
                [productName, description, '/'+pictureLink.substring(7), id]);
        } else
            await queryPromise(
                'UPDATE products SET productName=?, description=? WHERE id=?',
                [productName, description, id]);
        return;
    } catch(err) { throw err; }
};
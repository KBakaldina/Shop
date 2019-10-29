const queryPromise = require('../../libs/dbConnection').queryPromise;

module.exports = async  (id, productName, description, pictureLink) => {
    try{
        await queryPromise(
            'UPDATE products SET productName=?, description=?, pictureLink=? WHERE id=?',
            [productName, description, pictureLink, id]);
        return;
    } catch(err) { throw err; }
};
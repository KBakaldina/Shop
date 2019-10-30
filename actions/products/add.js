const queryPromise = require('../../libs/dbConnection').queryPromise;

module.exports = async  (productName, description, pictureLink, userId) => {
    try{
        await queryPromise(
            'INSERT INTO products(productName, description, pictureLink, userId) VALUES (?, ?, ?, ?)',
            [productName, description, '/'+pictureLink.substring(7), userId]);
        return;
    } catch(err) { throw err; }
};
const queryPromise = require('../../libs/dbConnection').queryPromise;

module.exports = async  (productName, price, description, pictureLink, userId) => {
    try{
        await queryPromise(
            'INSERT INTO products(productName, price, description, pictureLink, userId) VALUES (?, ?, ?, ?, ?)',
            [productName, parseFloat(price), description, '/'+pictureLink.substring(7), userId]);
        return;
    } catch(err) { throw err; }
};
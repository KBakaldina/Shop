const queryPromise = require('../libs/dbConnection').queryPromise;

module.exports = async  (productName, description, picLink, userId) => {
    try{
        await queryPromise(
            'INSERT INTO products(productName, description, pictureLink, userId) VALUES (?, ?, ?, ?)',
            [productName, description, picLink, userId]);
        return;
    } catch(err) { throw err; }
};
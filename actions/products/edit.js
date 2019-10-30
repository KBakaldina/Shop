const queryPromise = require('../../libs/dbConnection').queryPromise;

module.exports = async  (id, productName, description, pictureLink) => {
    try{
        if (pictureLink)
            await queryPromise(
                'UPDATE products SET productName=?, description=?, pictureLink=? WHERE id=?',
                [productName, description, pictureLink, id]);
        else
            await queryPromise(
                'UPDATE products SET productName=?, description=? WHERE id=?',
                [productName, description, id]);
        return;
    } catch(err) { throw err; }
};
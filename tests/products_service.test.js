const actionAddProduct = require ('../actions/products/add');

actionAddProduct.queryPromise = jest.fn((query, data) => {
    return new Promise((resolve, reject) => {
        console.log(data);
        return reject('err');
    });//DOES NOT WORK
});

describe ('Products service', () => {
    describe ('The action of adding a new product', () => {
        let paramNum = 1;
        test.each([
            [undefined, 1.11, 'description 1', '/uploads/pic1', 1],
            ['Second', undefined, 'description 2', '/uploads/pic2', 2],
            ['Third', 3.33, undefined, '/uploads/pic3', 3],
            ['Fourth', 4.44, 'description 4', undefined, 4],
            ['Fifth', 5.55, 'description 5', '/uploads/pic5', undefined],
        ])(`If any parameter of data(%s, %d, %s, %s, %d) is undefined, the action should throw an error`,
            async (productName, price, description, pictureLink, userId) => {
            let thrownError = false;

            try {
                await actionAddProduct(productName, price, description, pictureLink, userId);
            } catch (err) {
                thrownError = err.message;
                console.log('////////////////////////ERR: '+thrownError);
            }

            expect(thrownError).toBeTruthy();
        });
    });
});
const actionAddProduct = require ('../actions/products/add');

//TODO: a mock/stub/spy for the database?
describe ('Products service', () => {
    describe ('The process of adding a new product', () => {
        test.each([
            [undefined, 1.11, 'description 1', '/uploads/pic1', 1],
            ['Second', undefined, 'description 2', '/uploads/pic2', 2],
            ['Third', 3.33, undefined, '/uploads/pic3', 3],
            ['Fourth', 4.44, 'description 4', undefined, 4],
            ['Fifth', 5.55, 'description 5', '/uploads/pic5', undefined],
        ])('If any parameter is undefined, the action should throws an error',
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
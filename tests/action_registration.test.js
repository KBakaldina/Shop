describe ('User service', () => {
    beforeAll(() => {
        jest.mock('mysql');
        jest.mock('../libs/dbConnection', () => {
            const originalModule = jest.requireActual('../libs/dbConnection');
            originalModule.connection = jest.fn;

            originalModule.queryPromise = jest.fn(()=>[true]);
            return Object.assign({__esModule: true}, originalModule);
        });
    });

    afterAll(() => {
        jest.unmock('../libs/dbConnection');
    });

    describe ('The action of registration a new user', () => {
        it('should throw an error if userName is already exists in the database', async () => {
            const actionRegistration = require('../actions/registration');
            expect(actionRegistration()).rejects.toThrow();
        });
    });
});
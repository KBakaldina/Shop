module.exports = (code, name, message) => {
    let err = new Error();
    err.status = code;
    err.name = name;
    err.message = message;

    return err;
};
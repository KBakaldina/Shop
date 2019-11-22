const jwt = require('jsonwebtoken');

module.exports = (id, userName) => {
    const payload = {
        id: id,
        userName: userName
    };
    return jwt.sign(payload, process.env.JWT_SECRET);
};
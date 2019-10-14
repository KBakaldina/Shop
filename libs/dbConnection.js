var mysql = require('mysql');


var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'password',
        //
        database: 'registration'
});

connection.connect();

//проверить есть ли база



module.exports = connection;

var mysql = require('mysql');
var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'registration'
});

connection.connect();

module.exports = connection;


/*connection.query('SELECT .....',
    function (err, res) {
  if (err) throw error;
  console.log(res);
});

connection.end(function (err) {
  // The connection is terminated now
});*/

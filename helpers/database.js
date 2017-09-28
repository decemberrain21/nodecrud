 
var mysql = require('mysql');
var pool  = mysql.createPool({
	connectionLimit : 10,
	host: '127.0.0.1',
	user: 'root',
	password : '',
	//port : 8080,
	database:'aaa',
	multipleStatements:true
});

var getConnection = function(callback) {
    pool.getConnection(function(err, connection) {
		
        callback(err, connection);
    });
};

exports.getConnection = getConnection;


//exports.pool = pool;
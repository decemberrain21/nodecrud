var express = require('express');
var session	= require('express-session');
var SessionStore = require('express-mysql-session');

var app 	= express();
var bodyParser = require('body-parser');

var port 	= process.env.PORT || 8090;

var options = {
    host: '127.0.0.1',
	user: 'root',
	password : '',
   // port: 8080,
    database:'lala',
	multipleStatements:true
};

var sessionStore = new SessionStore(options);

app.use(session({
    key: 'mysession_cookie_name',
    secret: 'mysession_cookie_secret',
    store: sessionStore,
    resave: true,
    saveUninitialized: true
}));

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({limit: "10mb",extended: true}));
app.use(require('./controllers'));

app.listen(port, function() {
  console.log('Listening on port ' + port);
});
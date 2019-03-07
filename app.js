var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');


var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
server.listen(process.env.PORT || 2009);
require('../nienluan/soketIO/serverSocket')(io);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

var signinRouter = require('./routes/signin');
var signupRouter = require('./routes/signup');
var homeRouter = require('./routes/home');
var changeRouter = require('./routes/changepsw');
var videocallRouter = require('./routes/videocall');
var contactRouter = require('./routes/contact');


app.use('/', signinRouter);
app.use('/signup', signupRouter);
app.use('/home', homeRouter);
app.use('/changepsw', changeRouter);
app.use('/videocall', videocallRouter);
app.use('/contact', contactRouter);

module.exports = app;
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var http = require('http');
var app = express();


//connecting to db
var db = mongoose.connect("db url");



//view engine setup
app.set('views', './src/views');
app.set('view engine', 'ejs');

//routers
var authRouter = require("./src/routes/authRoutes");
var profileRouter = require("./src/routes/profileRoutes");
var projectRouter = require("./src/routes/projectRoutes");
var adminRouter = require("./src/routes/adminRoutes");

//using middleware
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret:"alabalaportokala",
    resave: false,
    saveUninitialized: false
}));
require('./src/config/passport')(app);

//routes
app.use('/auth', authRouter);
app.use('/profile', profileRouter);
app.use('/project', projectRouter);
app.use('/admin', adminRouter);

//index page
app.get("/", function (req, res) {
    res.render('index', {user:req.user});
});
var server = http.createServer(app);
var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'

//socket io
var io = require('socket.io').listen(server);
io.on('connection', function(socket) {
    socket.on('chat message', function(msg) {
        io.sockets.emit('new message', msg);
    });

});

//server
server.listen(server_port, server_ip_address, function(){
    console.log('Express server listening');
});

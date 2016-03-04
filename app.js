var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var routes = require('./routes/index');
var fieldData = require('./modelExt/extFieldData');

var app = express();

//模板
app.set('views', path.join(__dirname, '/views'));
app.engine('html', require('ejs-mate'));
app.set('view engine', 'html');
app.locals._layoutFile = 'main.html';


app.use(cookieParser('defaultCookieParser'));

//session存储
app.use(session({
    secret: 'defalutSession',
    name: 'testapp',
    cookie: {maxAge: 900000 },
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({   //创建新的mongodb数据库
        host: '192.168.2.1',    //数据库的地址，本机的话就是127.0.0.1，也可以是网络主机
        port: 27017,          //数据库的端口号
        db: 'nodejs'        //数据库的名称。
    })
}));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//资源路径
app.use('/', express.static('./public')).use('/lib', express.static('../lib'));

fieldData.init();

app.use('/', routes);

//404
app.use(function(req, res, next){ 
    res.status(404);
    res.render('404');
});

//500
app.use(function(err, req, res, next){
    console.error(err.stack);
    //res.status(500);
    res.render('500',{err: err});
});

//module.exports = app;


app.listen(3000, function(){
  console.log('Server starts at http://localhost:3000');
});

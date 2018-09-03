/*
 * Express App
 */

var cookieParser = require('cookie-parser');
var logger = require('morgan');
var createError = require('http-errors');
var compression = require('compression');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var session = require('express-session');
var helmet = require('helmet');

const express = require('express')
const path = require('path')

const PORT = process.env.PORT || 5000

// Create & configure Express server
const app = express();

// Express configuration
app.set("port", PORT);
app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'ejs');

// Use helmet. More info: https://expressjs.com/en/advanced/best-practice-security.html
var helmet = require('helmet')
app.use(helmet());

// Allow X-Frame from Marketing Cloud. Sets "X-Frame-Options: ALLOW-FROM http://exacttarget.com".
app.use(helmet.frameguard({
    action: 'allow-from',
    domain: 'http://exacttarget.com'
  }))

app.use(session({
    name: 'server-session-cookie-id',
    secret: 'sanagama-df18',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(cookieParser());
app.use(compression());
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Setup static paths
app.use(express.static(path.join(__dirname, "static")));
app.use(favicon(path.join(__dirname,'static','images', 'favicons', 'favicon.ico')));

// Setup routes
var indexRouter = require('./routes/index');
var demo1Router = require('./routes/demo1');
var demo2Router = require('./routes/demo2');

app.use('/', indexRouter);
app.use('/demo1', demo1Router);
app.use('/demo2', demo2Router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
  });
  
  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

module.exports = app;
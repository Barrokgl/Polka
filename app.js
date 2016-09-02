var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('./config');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var HttpError = require('./libs/error').HttpError;
var log = require('./libs/logs')(module);

// Mongo
// var mongo = require('mongodb');
// var monk = require('monk');
// var db = monk('localhost:27017/Polka');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  store: new FileStore,
  secret: config.get('session:secret'),
  saveUninitialized: config.get('session:saveUninitialized'),
  resave: config.get('session:resave')
}));
app.use(express.static(path.join(__dirname, 'public')));


// Make our db accessible to our router
// app.use(function(req,res,next){
//   req.db = db;
//   next();
// });

// registered users handler
app.use(require('./libs/loadUser'));

//Error sender
app.use(require('./libs/sendHttpError'));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new HttpError(404, 'Not Found');
  next(err);
});

// error handler

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  if (typeof err == 'number') { // next(404);
    err = new HttpError(err);
  }
  if (err instanceof HttpError) {
    res.sendHttpError(err);
  } else {
    // development error handler
    // will print stacktrace
    if (app.get('env') == 'development') {
        throw new Error(err);
    } else {
      log.error(err);
      err = new HttpError(500);
      res.sendHttpError(err);
    }
  }
});

module.exports = app;

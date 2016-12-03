const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const config = require('config');
const session = require('express-session');
const mongoStrore = require('connect-mongo')(session);
//var FileStore = require('session-file-store')(session);
const HttpError = require('libs/error').HttpError;
const log = require('libs/logs')(module);

const routes = require('routes/index');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cookieParser());
// app.use(session({
//   store: new FileStore,
//   secret: config.get('session:secret'),
//   saveUninitialized: config.get('session:saveUninitialized'),
//   resave: config.get('session:resave')
// }));
const connection = require('data/mongoose').connection;
app.use(session({
    store: new mongoStrore({
        mongooseConnection: connection,
        ttl: 14 * 24 * 60 * 60,
        autoRemove: 'native',
        touchAfter: 24 * 3600
    }),
    secret: config.get('session:secret'),
    saveUninitialized: config.get('session:saveUninitialized'),
    resave: config.get('session:resave'),

}));
app.use(express.static(path.join(__dirname, 'public')));

// registered login handler
app.use(require('libs/loadUser'));

//Error sender
app.use(require('libs/sendHttpError'));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new HttpError(404, 'Not Found');
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
        log.error(err);
        throw new Error(err);
    } else {
      log.error(err);
      err = new HttpError(500);
      res.sendHttpError(err);
    }
  }
});

module.exports = app;

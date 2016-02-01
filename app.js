var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var debug = require('debug')('bookmark');
var mailin = require('mailin');

var morgan = require('morgan');
var session = require('express-session');

var db       = require('./lib/db');
var config   = require('./config');
var passport = require('passport');
var flash    = require('connect-flash');

require('./config/passport')(passport); // pass passport for configuration

var app = express();
var server = http.createServer(app);
var io = require('socket.io')(server);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(__dirname + '/public/favicon.ico'));

// required for passport
app.use(session({ secret: config.passport.secret })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

app.use(flash()); // use connect-flash for flash messages stored in session

require('./routes/index')(app, io, passport);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.set('port', process.env.PORT || 3000);

db.sync().then(function() {
   server.listen(app.get('port'), function() {
      debug('Express server listening on port ' + server.address().port);
   });
});

mailin.start({
   port: 25,
   disableWebhook: true // Disable the webhook posting.
});

require('./controllers/incoming_mail')(mailin, io);

module.exports = app;

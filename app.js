var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');;
var logger = require('morgan');
var cors = require('cors');

//Routes

var indexRouter = require('./routes/index');
var accountRouter = require('./routes/account');
var servicesRouter = require('./routes/services');
var searchesRouter = require('./routes/search');
var invitationRouter = require('./routes/invitations');
var ratingRouter = require('./routes/rating');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({ origin: '*' }));

app.use('/', indexRouter);
app.use('/api/account', accountRouter);
app.use('/api/services', servicesRouter);
app.use('/api/search', searchesRouter);
app.use('/api/invitation', invitationRouter);
app.use('/api/rating', ratingRouter);

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
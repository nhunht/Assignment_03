const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const path = require('path');
const logger = require('morgan');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');

const url = 'mongodb://127.0.0.1:27017/wc2023'
const connect = mongoose.connect(url)

connect.then(() => {
  console.log('Connect OK!!!')
})

const User = require('./models/user');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/userRouter');
var playerRouter = require('./routes/playerRouter')
var nationRouter = require('./routes/nationRouter');

var app = express();

// view engine setup (Template build giao dien)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({
  extended: false
}));
app.use(session({
  name: 'session-id',
  secret: 'Reallystrongkey123',
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({
    mongoUrl: url,
  })
}));

const strategy = new LocalStrategy(User.authenticate())
passport.use(strategy);
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(passport.initialize());
app.use(passport.session());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/players', playerRouter);
app.use('/nations', nationRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
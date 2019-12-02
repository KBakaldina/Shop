const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');

require('dotenv').config();
require('./config/passport')(passport);

const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const registrationRouter = require('./routes/registration');
const forgotRouter = require('./routes/forgot');
const profileRouter = require('./routes/profile');
const productsRouter = require('./routes/products');
const shopRouter = require('./routes/shop');
const facebookRouter = require('./routes/facebook');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/registration', registrationRouter);
app.use('/forgot', forgotRouter);
app.use('/profile', profileRouter);
app.use('/products', productsRouter);
app.use('/shop', shopRouter);
app.use('/facebook', facebookRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

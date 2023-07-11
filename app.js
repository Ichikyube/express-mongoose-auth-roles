require('dotenv').config();
const createError = require('http-errors');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const csurf = require('@dr.pogodin/csurf');
const express = require('express');
const favicon = require('serve-favicon');
const flash = require("connect-flash");
const helmet = require('helmet');
const passport = require("passport");
const paginate = require('express-paginate');
const path = require('path');
// const session = require('express-session');
// const serveIndex = require('serve-index');
// const serveStatic = require('serve-static');
const logger = require('./settings/logger');
const errorHandler = require('./middlewares/handleError')
const connectDb = require("./db/conn");
const routes = require('./routes/index');
const pageNotFound = require('./middlewares/404')
// setting up the route middlewares
const csrfProtection = csurf({
  cookie: true
})
const app = express();
logger(app);
connectDb();
// Needed to be able to read body data
server.use(express.json()); // to support JSON-encoded bodies
server.use(express.urlencoded({ extended: true })); // to support URL-encoded bodies
app.use(cookieParser()); // Use express middleware for easier cookie handling
app.use(function (req, res, next) {
  res.locals._csrf = req.session._csrf;
  return next();
})
app.use(helmet());

app.use(csrfProtection);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }),
);

// overriding with the X-HTTP-Method-Override header in our request
app.use(mthdOverride('X-HTTP-Method-Override'))

var srcPath = path.join(__dirname, '/sass');
var destPath = path.join(__dirname, '/public/css');
app.use(require('node-sass-middleware')({
  src: srcPath,
  dest: destPath,
  debug: true,
  outputStyle: 'expanded'
}));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(__dirname + '/public/stylesheets'));
app.use('/img', express.static(__dirname + '/public/images'));
app.use('/js', express.static(__dirname + '/public/javascripts'));
app.use(express.multipart());
// keeping this before all the routes that will use pagination
app.use(paginate.middleware(10, 50));
app.use(app.router);
// app.use('/', routes);
app.use('/', indexRouter);
app.use('/users', usersRouter);
//authentication middleware

app.use(function (req, res, next) {
  console.log("Request IP: " + req.url);
  console.log("Request date: " + new Date());
  next();
});
app.use(function (req, res, next) {
  var filePath = path.join(__dirname, "static", req.url);
  fs.stat(filePath, function (err, fileInfo) {
    if (err) {
      next();
      return;
    }
    if (fileInfo.isFile()) {
      res.sendFile(filePath);
    } else {
      next();
    }
  });
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
app.use(function (req, res, next) {
  console.log("Request IP: " + req.url);
  console.log("Request date: " + new Date());
  next();
});
// If the requested resource is not found
app.all('*', pageNotFound);

// error handler
app.use(errorHandler);

module.exports = app;

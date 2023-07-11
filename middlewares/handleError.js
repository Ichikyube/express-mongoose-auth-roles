/**
 * Error responses
 */
// last app.use calls right before app.listen():

// custom 404
app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!")
})

// custom error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
  });
  // the error handler
  app.use(function (error, req, res, next) {
    if (error.code !== 'EBADCSRFTOKEN') return next(error)
    // handling the CSRF token errors is done here
    res.status(403)
    res.send(' The form was tampered with')
  })
  app.use(require('flash')());
  app.use(function (req, res) {
    // flashing a message
    req.flash('info', 'hello there!');
    next();
  })
  // error handler
  if ('development' == app.get('env')) {
    app.use(express.errorHandler());
  }
  if (process.env.NODE_ENV === 'development') {
    // only use in development
    app.use(errorhandler())
  }
  app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    console.error(err.stack);
    res.render('error');
  });
  
// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: '', password: '' };

  // incorrect email
  if (err.message === 'incorrect email') {
    errors.email = 'That email is not registered';
  }

  // incorrect password
  if (err.message === 'incorrect password') {
    errors.password = 'That password is incorrect';
  }

  // duplicate email error
  if (err.code === 11000) {
    errors.email = 'that email is already registered';
    return errors;
  }

  // validation errors
  if (err.message.includes('user validation failed')) {
    // console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(val);
      // console.log(properties);
      errors[properties.path] = properties.message;
    });
  }

  return errors;
}
const constants = {
  VALIDATION_ERROR: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};

const errorHandler = (err, req, res, next) => {
  res.status(err.status || 500); //server Error
  const statusCode = res.statusCode;
  const stackTrace = req.app.get('env') === 'development' ? err.stack : {};
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = stackTrace;  
  // logEvents(`${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.path}\t
  // ${req.headers.origin}`, 'errLog.log');
  logEvents(`Path: ${req.path}, Method: ${req.method}, ${err.name}: ${err.message}`, 'errLog.txt');
  console.log(
    `[Error Handler]: Path: ${req.path}, Method: ${req.method}, ${stackTrace}`
  );
  if (req.xhr) {
    let title;
    switch (statusCode) {
      case constants.VALIDATION_ERROR:
        title = "Validation Failed";
        break;
      case constants.NOT_FOUND:
        title = "Not Found";
      case constants.UNAUTHORIZED:
        title = "Unauthorized";
      case constants.FORBIDDEN:
        title = "Forbidden";
      case constants.SERVER_ERROR:
        title = "Server Error";
      default:
        title = err.name
    }
    res.status(statusCode).json({
      title,
      message: err.message,
      stackTrace,
    });
  }
  else {
    next(err)
  }
};

module.exports = errorHandler;

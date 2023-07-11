var express = require('express');
var router = express.Router();
const passport = require('passport');
const auth = require('../controllers/authController');
const passportService = require('../services/passport');

const requireAuth = passport.authenticate('jwt', {
  session: false
})
const requireSignin = passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/login',
  failureFlash: true,
  session: false
})
var ftpPath = path.join(__dirname, 'public/ftp');
// Serve URLs like /ftp/thing as public/ftp/thing
// The express.static serves the file contents
// The serveIndex is this module serving the directory
function setCustomCacheControl(res, path) {
  if (serveStatic.mime.lookup(path) === 'text/html') {
    // Custom Cache-Control for HTML files
    res.setHeader('Cache-Control', 'public, max-age=0')
  }
}
module.exports = function (app) {
    
  app.use(function (req, res, next) {
    if (req.session && req.session.authenticated)
      return next();
    else {
      return res.redirect('/login');
    }
  })

  app.post('/login', function (req, res) {
    // check the database for the username and password combination
    db.findOne({
        username: req.body.username,
        password: req.body.password
      },
      function (error, user) {
        if (error) return next();
        if (!user) return next(new Error('Bad username/password'));
        req.session.user = user;
        res.redirect('/protected_area');
      }
    );
  });
  router.post("/signup", function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    // body-parser adds the
    // username and password
    // to req.body.
    User.findOne({
      username: username
    }, function (err, user) {
      if (err) {
        return next(err);
      }
      if (user) {
        req.flash("error", "User already exists");
        return res.redirect("/signup");
      }
      // If you find a user, you should
      // bail out because that
      // username already exists.
      var newUser = new User({
        // Creates a new instance of
        username: username,
        // the User model with the
        password: password
        // username and password
      });
      newUser.save(next);
      // Saves the new user to the
      // database and continues to
    });
    // the next request handler
  }, passport.authenticate("login", {
    successRedirect: "/",
    failureRedirect: "/signup",
    //  Authenticates
    failureFlash: true
    //  the user
  }));
  router.use('/login', requireSignin, auth.loginUser);
  router.use('/register', auth.registerUser);
  router.use('/ftp', serveStatic(ftpPath, {
    setHeaders: setCustomCacheControl,
    index: ['default.html', 'default.htm']
  }), serveIndex(ftpPath, {
    'icons': true
  }))
  /* GET home page. */
  router.get('/', requireAuth, function (req, res, next) {
    // res.setHeader('Content-Type', 'application/json')
    // res.end(JSON.stringify({
    //   text: 'hi',
    //   numbers: [1, 2, 3]
    // }));
    res.render('index', {
      title: 'Express',
      message: 'hello, there!'
    });
  });
}


module.exports = router;
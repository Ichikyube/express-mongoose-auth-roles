const expiryDate = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
var sess = {
  genid: function (req) {
    return genuuid() // using UUIDs for the session IDs
  },
  name: 'myappsIds',
  secret: '59B93087-78BC-4EB9-993A-A61FC844F6C9',
  resave: false,
  saveUninitialized: true,
  keys: ['key1', 'key2'],
  cookie: {
    path: '/',
    domain: 'localhost',
    sameSite: true,
    httpOnly: true,
    secure: false,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    expires: expiryDate
  }
};

if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trusting first proxy
  sess.cookie.secure = true // serving secure cookies
}

app.use(cookieSession(sess))
app.use(function (req, res, next) {
  var session = req.session
  if (session.views) {
    session.views++
    res.setHeader('Content-Type', 'text/html')
    res.write('<p>views: ' + session.views + '</p>')
    res.write('<p>will expires in: ' + (session.cookie.maxAge / 1000) + 's</p>')
    res.end()
  } else {
    session.views = 1
    res.end(' This is a demo for sessions. Refresh the page!')
  }
  req.session.nowInMinutes = Math.floor(Date.now() / 60e3)
  req.session.regenerate(function (error) {
    // a new session should be added here
  })
  req.session.destroy(function (error) {
    // a session cannot be accessed here.
  })
  req.session.reload(function (error) {
    // the session has been updated
  })
  req.session.save(function (error) {
    // session has been saved
  })
  next()
})
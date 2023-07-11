const express = require('express'),
    session = require('express-session'),
    morgan = require('morgan'),
    path = require("path"),
    fs = require("fs"),
    url = require("url"),
    Router = require('router'),
    router = Router(),
    http = require('http'),
    https = require('https'),
    app = express(),
    requirejs = require("requirejs"),
    mustache = require("mustache"),
    ejs = require('ejs'),
    engine = require('ejs-mate')
passport = require('passport');

var mongoose = require("mongoose"),
    MongoStore = require('connect-mongo')(session);
mongoose.connect('', function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("Connected to the database")
    }
});
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.use(express.static(__dirname + 'public'));
app.get('/', (req, res, next) => {
    (res).render(home);
})
app.get('/login', (req, res, next) => {
    if (req.user) return res.redirect('/')
    res.render('/login')
})
app.post('/login',
    passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/login'
    }),
    function (req, res) {
        res.redirect('/');
    });
app.get('/', (req, res) => {
    res.logout();
    res.redirect('/');
});
app.get('/profile', (req, res, next) => {
    res.render('profile')
})
app.use(morgan('dev'))
// gzip/deflate outgoing ress
var compression = require('compression');
app.use(compression());

// store session state in browser cookie
var cookieParser = require('cookie-parser'),
    cookieSession = require('cookie-session');
app.use(cookieParser());
app.use(cookieSession({
    resave: true,
    saveUnitialized: true,
    secret: "Hello",
    store: new MongoStore({
        url: '',
        autoReconnect: true
    }),
    keys: ['secret1', 'secret2']
}));

// parse urlencoded req bodies into req.body
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

var userName, html, template = "",
    parentTmpl, tmplFile;
app.use(function (req, res) {
    userName = {
        firstName: req.body.firstName,
        lastName: req.body.lastName
    };
    tmplFile = fs.createReadStream(path.join(__dirname, 'public/index.html'), {
        encoding: "utf8"
    });

    tmplFile.on("data", function (data) {
        template += data;
    });
    tmplFile.on("end", function () {
        html = mustache.render(template, userName);
        res.end(html);
    });
});

app.use(router.get("/sayHello/:firstName/:lastName", function (req, res) {
    userName = req.params.firstName + " " + req.params.lastName;
    html = "<html lang=\"en\"><head><title>Hello " + userName + "</title></head>" +
        "<body>" + userName + ", you are in nowhere</div></body></html>";
    res.end(html);
}));

app.use(router.use("/builder", function (req, res) {
    var options = {
        shim: req.body.html5shim,
        flash: req.body.useFlash,
        sockets: req.body.useWebSockets,
        jsonp: req.body.useJsonp
    };
    requirejs(["text!public/js/builder.js"], function (tmpl) {
        var js = mustache.render(tmpl, options);
        res.writeHead(200, {
            "Content-Type": "application/javascript",
            "Content-Length": js.length
        });
        res.end(js);
    });
}));

app.use(router.use("/theme", function (req, res) {
    var theme = {
        main: req.body.mainColor,
        secondary: req.body.secondaryColor,
        border: req.body.borderStyle,
        corners: req.body.borderRadius
    };
    requirejs(["text!public/css/theme.css"], function (tmpl) {
        var css = mustache.render(tmpl, theme);
        res.writeHead(200, {
            "Content-Type": "text/css",
            "Content-Length": css.length
        });
        res.end(css);
    });
}));

const server = http.createServer(app);
const {
    Server
} = require("socket.io");
const {
    default: mongoose
} = require('mongoose');
/*const {
    RESERVED_EVENTS
} = require('socket.io/dist/socket');*/
const io = new Server(server).listen(1337);
//create node.js http server and listen on port
io.on('connection', (socket) => {
    console.log('a user connected');
});
server.listen(3000, () => {
    console.log('listening on *:3000');
});

function render(res, filename, data, style, script, callback) {
    requirejs(["text!public/" + filename], function (tmpl) {
        if (callback) {
            callback(res, tmpl, data, style, script);
        } else {
            var html = mustache.render(
                parentTmpl, {
                    content: data
                }, {
                    content: tmpl,
                    stylesheets: style || "",
                    scripts: script || ""
                }
            );
            res.end(html);
        }
    })
}

import path from 'path';

var whitelist = ['http://sample1.com', 'http://sample2.com'];
var cOptionsDelegate = function (req, callback) {
	var cOptions;
	if (whitelist.indexOf(req.header('Origin')) !== -1) {
		cOptions = {
			origin: true
		}; // reflecting (enabling) the requested origin in our CORS
		response
	} else {
		cOptions = {
			origin: false
		}; // disabling the CORS for our request
	}
	callback(null, cOptions); // callback needs two parameters: error and the options
};
var checkUserIsAdmin = function (req, res, next) {
	if (req.session && req.session._admin !== true) {
		return next(401);
	}
	return next();
};
//admin route that fetches users and call render function
var admin = {
	main: function (req, res, next) {
		req.db.get('users').find({}, function (e, users) {
			if (e) return next(e);
			if (!users) return next(new Error('No users to display.'));
			res.render('admin/index.html', users);
		});
	}
};
export default function (app) {
	// Insert routes below
	app.use('/api/things', require('./api/thing'));
	app.use('/api/users', require('./api/user'));
	app.use('/auth', require('./auth').default);

	// All undefined asset or api routes should return a 404
	app.route('/:url(api|auth|components|app|bower_components|assets)/*')
		.get(errors[404]);

	// All other routes should redirect to the app.html
	app.route('/*')
		.get((req, res) => {
			res.sendFile(path.resolve(`${app.get('appPath')}/app.html`));
		});

	app.post('/api/register', async (req, res) => {
		console.log(req.body)
		try {
			const newPassword = await bcrypt.hash(req.body.password, 10)
			await User.create({
				name: req.body.name,
				email: req.body.email,
				password: newPassword,
			})
			res.json({
				status: 'ok'
			})
		} catch (err) {
			res.json({
				status: 'error',
				error: 'Duplicate email'
			})
		}
	})

	app.post('/api/login', async (req, res) => {
		const user = await User.findOne({
			email: req.body.email,
		})

		if (!user) {
			return {
				status: 'error',
				error: 'Invalid login'
			}
		}

		const isPasswordValid = await bcrypt.compare(
			req.body.password,
			user.password
		)

		if (isPasswordValid) {
			const token = jwt.sign({
					name: user.name,
					email: user.email,
				},
				'secret123'
			)

			return res.json({
				status: 'ok',
				user: token
			})
		} else {
			return res.json({
				status: 'error',
				user: false
			})
		}
	})

	app.get('/api/quote', async (req, res) => {
		const token = req.headers['x-access-token']

		try {
			const decoded = jwt.verify(token, 'secret123')
			const email = decoded.email
			const user = await User.findOne({
				email: email
			})

			return res.json({
				status: 'ok',
				quote: user.quote
			})
		} catch (error) {
			console.log(error)
			res.json({
				status: 'error',
				error: 'invalid token'
			})
		}
	})

	app.post('/api/quote', async (req, res) => {
		const token = req.headers['x-access-token']

		try {
			const decoded = jwt.verify(token, 'secret123')
			const email = decoded.email
			await User.updateOne({
				email: email
			}, {
				$set: {
					quote: req.body.quote
				}
			})

			return res.json({
				status: 'ok'
			})
		} catch (error) {
			console.log(error)
			res.json({
				status: 'error',
				error: 'invalid token'
			})
		}
	})


	app.get("/", csrfProtection, (req, res) => {
		//console.log(req.cookies)

		// imagine this next line where we set the cookie instead only happened if you had just provided a correct username and password etc...
		res.cookie("simpletest", "qwerty", {
			httpOnly: true
		})

		res.send(`<form action="/transfer-money" method="POST">
                    <input type="text" name="amount" placeholder="amount">
                    <input type="text" name="to" placeholder="Send to...">
                    <input type="hidden" name="_csrf" value="${req.csrfToken()}">
                    <button>Submit</button>
                </form>`)
	})

	app.post("/transfer-money", csrfProtection, (req, res) => {
		//console.log(req.cookies)
		if (req.cookies.simpletest === "qwerty") {
			res.send("Success!")
		} else {
			res.send("Failed!")
		}
	})

	app.use((err, req, res, next) => {
		if (err.code !== "EBADCSRFTOKEN") return next(err)

		res.status(403)
		res.send("CSRF attack detected!")
	})
	//display list of users for admin dashboard
	app.get('/admin', checkUserIsAdmin, admin.main);
    
    app.get('/admin', function (req, res, next) {
        if (!req.query._token) return next(new Error('no token provided'));
    }, function (req, res, next) {
        res.render('admin');
    });
    
    app.get(/^\/users\/(\d+)-(\d+)$/, function (req, res) {
        var startId = parseInt(req.params[0], 10);
        var endId = parseInt(req.params[1], 10);
        // ...
    });
    
    app.get('/form', function (req, res) {
        // passing the csrfToken to our view
        res.render('send', {
            csrfToken: req.csrfToken()
        })
    })

    // server-sent event stream
    app.get('/events', function (req, res) {
        res.setHeader('Content-Type', 'text/event-stream')
        res.setHeader('Cache-Control', 'no-cache')
    
        // send a ping approx every 2 seconds
        var timer = setInterval(function () {
            res.write('data: ping\n\n')
            res.flush()
        }, 2000)
    
        res.on('close', function () {
            clearInterval(timer)
        })
    })
    
    app.get('/products/:id', cors(cOptionsDelegate), function (req, res, next) {
        res.json({
            msg: 'This has CORS enabled for the whitelisted domain.'
        });
    });
}



const bcrypt = require('bcrypt')
const User = require('../models/user')
const asyncErrorHandler = require('./../Utils/asyncErrorHandler');

//@desc Current user info
//@route POST /api/users/current
//@access private
module.exports.currentUser = asyncHandler(async (req, res) => {
    res.json(req.user);
});


module.exports.login = (req, res) => {
    var username = ""
    var password = ""
    const data = req.flash('data')[0];
    if (typeof data != "undefined") {
        username = data.username
        password = data.password
    }
    res.render('login', {
        errors: req.flash('validationErrors'), //req.session.validationErrors
        username: username,
        password: password
    })
}

//@desc Login user
//@route POST /api/users/login
//@access public
exports.loginUser = asyncHandler(async (req, res) => {
    const {
        email,
        password
    } = req.body;
    if (!email || !password) {
        return res.status(422).send({
            error: 'You must provide username and password!'
        });
    }
    // try {
    //     const user = await User.login(email, password);
    // } catch (err) {
    //     const errors = handleErrors(err);
    //     res.status(400).json({
    //         errors
    //     });
    // }
    const user = await User.findOne({
        email: email
    });
    //compare password with hashedpassword
    if (user && user.validatePassword(password)) {
        //     const token = createToken(user._id);
        //     res.cookie('jwt', token, {
        //         httpOnly: true,
        //         maxAge: maxAge * 1000
        //     });
        //     res.status(200).json({
        //         user: user._id
        //     });
        // req.session.userId = user._id
        // res.redirect('/')
        const accessToken = createAccessToken(user);
        res.status(200).json({
            accessToken
        });
    } else {
        // console.log("/auth/login::", user)
        // res.redirect('/auth/login')
        res.status(401).json({
            message: 'Invalid username or password'
        });
    }
});

// controller actions
module.exports.register = (req, res) => {
    res.render('signup');
}

//@desc Register a user
//@route POST /api/users/register
//@access public
module.exports.registerUser = asyncHandler(async (req, res, next) => {
    const {
        username,
        email,
        password
    } = req.body;
    if (!username || !email || !password) {
        return res.status(422).json({
            message: 'All field are required'
        });
    }
    const userAvailable = await User.findOne({
        email
    });
    if (userAvailable) {
        res.status(400);
        throw new Error("User already registered!");
    }
    //Check for duplicate
    User.findOne({
        $or: [{
            email
        }, {
            username
        }]
    }, function (err, existingUser) {
        if (err) {
            return next(err);
        }
        if (existingUser) {
            req.flash("error", "Username or Email already exists");
            // res.status(422).json({
            //     error: "Username or Email already exists"
            // });
            return res.redirect("/signup");
        }
    }).lean().exec();
    // If a user with email and username are unique, Save this User to Database
    const newUser = await User.create({
            username,
            email,
            password: await bcrypt.hash(password, 10)
        })
        .then(user => {
            if(!user) {
                res.status(400);
                throw new Error("User data us not valid");
            }
            //     res.status(201).json({
            //         _id: user.id,
            //         email: user.email
            //     });
            if (req.body.roles) {
                Role.findAll({
                    where: {
                        name: {
                            [Op.or]: req.body.roles
                        }
                    }
                }).then(roles => {
                    user.setRoles(roles).then(() => {
                        res.send({
                            status: 'success',
                            message: `User ${username} was registered as ${req.body.roles} successfully!`,
                            data: {
                                user: newUser,
                                token: token.generateToken(savedUser)
                            }
                        });
                    });
                });
            } else {
                // user role = 1
                user.setRoles([1]).then(() => {
                    res.status(201).json({
                        status: 'success',
                        message: `User ${username} was registered successfully!`,
                        data: {
                            user: newUser,
                            token: token.generateToken()
                        }
                    });
                });

            }
            // res.json({ success:true });
            const token = createToken(user._id);
            res.cookie('jwt', token, {
                httpOnly: true,
                maxAge: maxAge * 1000
            });
            res.status(201).json({
                user: user._id
            });
            res.redirect('/')
        })
        .catch(err => {
            // const errors = handleErrors(err);
            // res.status(400).json({
            //     errors
            // });
            // res.status(500).send({
            //     message: err.message
            // });
            const validationErrors = Object
                .keys(err.errors)
                .map(key => err.errors[key].message)
            //req.session.validationErrors = validationErrors
            req.flash('validationErrors', validationErrors)
            req.flash('data', req.body)

            return res.redirect('/auth/register')
        });

});

exports.signout = (req, res) => {
    // res.cookie('jwt', '', {
    //     maxAge: 1
    // });
    req.session.destroy(() => {
        res.redirect('/')
    })
}



module.exports = (req, res) => {
	res.render('login')
}



const {
    createAccessToken,
    createRefreshToken,
    sendRefreshToken,
    sendAccessToken,
  } = require('./tokens.js');
  const { fakeDB } = require('./fakeDB.js');
  const { isAuth } = require('./isAuth.js');
  
// 1. Register a user
// 2. Login a user
// 3. Logout a user
// 4. Setup a protected route
// 5. Get a new accesstoken with a refresh token


// 1. Register a user
app.post('/register', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // 1. Check if the user exist
      const user = fakeDB.find(user => user.email === email);
      if (user) throw new Error('User already exist');
      // 2. If not user exist already, hash the password
      const hashedPassword = await hash(password, 10);
      // 3. Insert the user in "database"
      fakeDB.push({
        id: fakeDB.length,
        email,
        password: hashedPassword,
      });
      res.send({ message: 'User Created' });
      console.log(fakeDB);
    } catch (err) {
      res.send({
        error: `${err.message}`,
      });
    }
  });
  
  // 2. Login a user
  app.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // 1. Find user in array. If not exist send error
      const user = fakeDB.find(user => user.email === email);
      if (!user) throw new Error('User does not exist');
      // 2. Compare crypted password and see if it checks out. Send error if not
      const valid = await compare(password, user.password);
      if (!valid) throw new Error('Password not correct');
      // 3. Create Refresh- and Accesstoken
      const accesstoken = createAccessToken(user.id);
      const refreshtoken = createRefreshToken(user.id);
      // 4. Store Refreshtoken with user in "db"
      // Could also use different version numbers instead.
      // Then just increase the version number on the revoke endpoint
      user.refreshtoken = refreshtoken;
      // 5. Send token. Refreshtoken as a cookie and accesstoken as a regular response
      sendRefreshToken(res, refreshtoken);
      sendAccessToken(res, req, accesstoken);
    } catch (err) {
      res.send({
        error: `${err.message}`,
      });
    }
  });
  
  // 3. Logout a user
  app.post('/logout', (_req, res) => {
    res.clearCookie('refreshtoken', { path: '/refresh_token' });
    // Logic here for also remove refreshtoken from db
    return res.send({
      message: 'Logged out',
    });
  });
  
  // 4. Protected route
  app.post('/protected', async (req, res) => {
    try {
      const userId = isAuth(req);
      if (userId !== null) {
        res.send({
          data: 'This is protected data.',
        });
      }
    } catch (err) {
      res.send({
        error: `${err.message}`,
      });
    }
  });
  
  // 5. Get a new access token with a refresh token
  app.post('/refresh_token', (req, res) => {
    const token = req.cookies.refreshtoken;
    // If we don't have a token in our request
    if (!token) return res.send({ accesstoken: '' });
    // We have a token, let's verify it!
    let payload = null;
    try {
      payload = verify(token, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
      return res.send({ accesstoken: '' });
    }
    // token is valid, check if user exist
    const user = fakeDB.find(user => user.id === payload.userId);
    if (!user) return res.send({ accesstoken: '' });
    // user exist, check if refreshtoken exist on user
    if (user.refreshtoken !== token)
      return res.send({ accesstoken: '' });
    // token exist, create new Refresh- and accesstoken
    const accesstoken = createAccessToken(user.id);
    const refreshtoken = createRefreshToken(user.id);
    // update refreshtoken on user in db
    // Could have different versions instead!
    user.refreshtoken = refreshtoken;
    // All good to go, send new refreshtoken and accesstoken
    sendRefreshToken(res, refreshtoken);
    return res.send({ accesstoken });
  });
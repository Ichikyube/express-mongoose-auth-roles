const {
    Passport
} = require("passport");

const User = require('.model/user')
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

//Setup options for Local Strategy
const LocalOptions = {
    userNameField: "email",
    passportField: "password",
    passReqToCallback: true
}

//Setup options for JWT Strategy
const JWTOptions = {
    jwtFromRequest: ExtractJWT.fromHeader('authorization'),
    secretOrKey: process.env.secret
}

const localLogin = new LocalStrategy(LocalOptions, async (email, password, done) => {
    try {
        // Validate the username and password against your user database
        const user = await User.findOne({ email });

        if (!user || !user.validatePassword(password)) {
            return done(null, false, { message: 'Invalid username or password' });
        }

        return done(null, user);
    } catch (error) {
        return done(error);
    }
});

const jwtLogin = new JWTStrategy(JWTOptions, function(payload, done) {
    User.findById(payload.sub, function(err, user) {
        if(err) return done(err, false);
        if(user) {
            done(null, user);
        } else {
            done(null, false);
        }
    });
});

Passport.use(localLogin);
Passport.use(jwtLogin);

module.exports = function () {
    Passport.serializeUser(function (user, done) {
        done(null, user._id);
    })
    Passport.deserializeUser(function (id, done) {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    })
};
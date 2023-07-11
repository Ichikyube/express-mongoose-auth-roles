const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
var uniqueValidator = require('mongoose-unique-validator')
const Schema = mongoose.Schema;
var SALT_FACTOR = 10;
const userSchema = new Schema({
    username: {
        type: String,
        required: [true,'Please provide username'],
        unique: true
    },
    email: {
        type: String,
        required: [true, 'Please enter an email.'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please enter a valid email.']
    },
    password: {
        type: String,
        required: [true,'Please provide password']
    },
    confirmPassword: {
        type: String,
        required: [true, 'Please confirm your password.']
    },
    roles: [{
        type: String,
        default: "Regular"
    }],
    active: {
        type: Boolean,
        default: true
    }
});

UserSchema.plugin(uniqueValidator)
var noop = function () {};

// The create() function fires save() hooks, and before save() hook
// and before save() hook a user, encrypt the user password first 
UserSchema.pre('save',function(next){
    const user = this;
    if (!user.isModified("password")) {
        return next();
    }
    bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
        if (err) {
            return next(err);
        }
        bcrypt.hash(user.password, salt, noop, function (err, hashedPassword) {
            if (err) {
                return next(err);
            }
            user.password = hashedPassword; //overwrite the password with the encrypted one
            done();
        });
    });
})

userSchema.methods.validatePassword = function (password, done) {
    bcrypt.compare(password, this.password, (err, isMatch) => {
        if (err) return done(err);
        if (isMatch) {
            // passwords match! log user in
            return done(null, isMatch);
        } else {
            // passwords do not match!
            return done(null, false);
        }
    });
};
userSchema.methods.name = function () {
    return this.displayName || this.username;
};
const User = mongoose.model('user', userSchema);
module.exports = User;

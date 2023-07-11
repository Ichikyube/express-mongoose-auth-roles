const User = require('../models/user')
const bcrypt = require('bcrypt')
module.exports = (req, res) => {
    const {
        username,
        password
    } = req.body;
    User.findOne({
        username: username
    }, (error, user) => {
        if (user) {
            bcrypt.compare(password, user.password, (error, same) => {
                if (same) {
                    req.session.userId = user._id
                    res.redirect('/')
                } else {
                    res.redirect('/auth/login')
                }
            })
        } else {
            res.redirect('/auth/login')
        }
    })
}

module.exports = (req, res, next) => {
    User.findById(req.session.userId, (error, user) => {
        if (error || !user)
            return res.redirect('/')
        next()
    })
}

module.exports = (req, res, next) => {
    if (req.session.userId) {
        return res.redirect('/') // if user logged in, redirect to home page
    }
    next()
}
/* eslint-disable no-shadow */
const bcrypt = require('bcryptjs');
const passport = require('passport');

const User = require('../models/user');
const userSchema = require('../schemas/user');

// Create new user
exports.createUser = (req, res, next) => {
    const { name, email, password, password2 } = req.body;
    const errors = [];

    if (!name || !email || !password) {
        errors.push({ msg: 'All fields have to be filled.' });
    }

    if (password !== password2) {
        errors.push({ msg: 'Both passwords have to be the same.' });
    }

    if (password.length < 5) {
        errors.push({ msg: 'Password has to be at least 5 characters long.' });
    }

    User.findOne({
        where: { email },
    })
        .then((user) => {
            if (user) {
                errors.push({ msg: 'This e-mail is already registered.' });
            }
        })
        .then(() => {
            if (errors.length > 0) {
                res.status(400).json(errors);
            } else {
                userSchema.requiredKeys('name').validate({
                    name,
                    email,
                    password,
                }, (err, value) => {
                    if (err) {
                        next(err);
                    } else {
                        bcrypt.genSalt(10, (err, salt) => {
                            bcrypt.hash(value.password, salt, (err, hash) => {
                                if (err) throw err;
                                User.create({
                                    name: value.name,
                                    email: value.email,
                                    password: hash,
                                    type: 'User',
                                })
                                    .then(() => {
                                        res.status(201).end();
                                    })
                                    .catch(next);
                            });
                        });
                    }
                });
            }
        });
};

// Log in user
exports.loginUser = (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/movies',
        failureRedirect: '/login?failure=true',
    })(req, res, next);
};

// Log out user
exports.logoutUser = (req, res) => {
    req.logout();
    res.status(200).end();
};

// Authenticate user
exports.authenticateUser = (req, res) => {
    if (req.isAuthenticated()) {
        const { id, name, email, type } = req.user;
        res.status(200).json({
            status: 'LOGGED',
            id,
            name,
            email,
            type,
        });
    } else {
        res.status(200).json({ status: 'NOT_LOGGED' });
    }
};

const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const User = require('../models/user');

module.exports = (passport) => {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            User.findOne({ where: { email } })
                // eslint-disable-next-line consistent-return
                .then((user) => {
                    if (!user) {
                        return done(null, false);
                    }

                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) throw err;
                        if (isMatch) {
                            return done(null, user);
                        }
                        return done(null, false);
                    });
                })
                .catch((err) => done(err));
        }),
    );

    passport.serializeUser((user, done) => done(null, user.id));

    passport.deserializeUser((id, done) => {
        User.findByPk(id)
            .then((user) => done(null, user))
            .catch((err) => done(err));
    });
};

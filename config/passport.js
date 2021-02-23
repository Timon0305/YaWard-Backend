const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// Load User Model
const User  = require('../models/userModel/User');

module.exports = function (passport) {
    passport.use(
        new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
            // Match User
            User.findOne({email: email})
                .then(user => {
                    if (!user) {
                        return done(null, false, {message: 'That email is not registered'});
                    }
                    //Match Password
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) throw err;

                        if (isMatch) {
                            const status = user.status;
                            if (status === 'pending') {
                                return done(null, false, {message: 'You are not activated'})
                            }
                            else if (status) {
                                return done(null, user)
                            } else {
                                return done(null, false, {message: 'You are blocked'})
                            }
                        } else {
                            return done(null, false, {message: 'mistake password'})
                        }
                    });
                })
                .catch(error => console.log(error))
        })
    );

    passport.serializeUser((user, done) =>  {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
};
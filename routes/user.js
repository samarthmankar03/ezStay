const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const passport = require('passport');
const wrapAsync = require('../utils/wrapAsync.js');
const {saveRedirectUrl} = require('../middleware.js');


router
    .route('/signup')
    .get((req, res) => {
        res.render('users/signup');
    })
    .post(async (req, res) => {
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        try {
            const user = new User({ username, email });
            const registeredUser = await User.register(user, password);
            req.login(registeredUser, (err) => {
                if (err) {
                    return next(err);
                }
                req.flash('success', 'Welcome to Wanderlust!');
                res.redirect('/listings');
            });
        } catch (e) {
            req.flash('error', e.message);
            res.redirect('/signup');
        }
    })

router
    .route('/login')
    .get((req, res) => {
        res.render('users/login');
    })
    .post(saveRedirectUrl, passport.authenticate('local', {
        failureRedirect: '/login',
        failureFlash: true,
    }),
    async (req, res) => {
        req.flash('success', 'Welcome back!');
        console.log(res.locals.redirectUrl);
        res.redirect(res.locals.redirectUrl || '/listings');
        // delete req.session.redirectUrl; // Clear the redirect URL after use 
    })


router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash('success', 'you are logged out!');
        res.redirect('/listings');
    });
});

module.exports = router;
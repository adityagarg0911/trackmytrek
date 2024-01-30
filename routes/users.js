const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const passport = require('passport');
const { func } = require('joi');
const {storeReturnTo} = require('../middleware');

router.get('/register', (req, res) => {
    res.render('users/register'); // users folder in views folder
});

router.post('/register', catchAsync(async (req, res, next) => {
    try{
        const {email, username, password} = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user, password);
        // console.log(registeredUser);
        req.login(registeredUser, err => {
            if(err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect('/campgrounds');
        })
    }
    catch(e){
        req.flash('error', e.message);
        res.redirect('/register');
    }
}));

router.get('/login', (req, res) => {
    res.render('users/login'); // users folder in views folder
});

router.get('/logout', (req, res) => {
    req.logout(function(err) {
        if(err){
            return next(err);
        }
        req.flash('success', "Good Bye!")
        res.redirect('/campgrounds');
    });
});

router.post('/login', storeReturnTo, passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
})

module.exports = router;
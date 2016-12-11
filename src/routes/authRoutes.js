var express = require('express');
var authRouter = express.Router();
var passport = require('passport');
var Account = require("../models/Account");
var mongoose = require('mongoose');

authRouter.post('/signUp', function(req,res) {
    if(req.body.password != req.body.confirmPassword) {
        return res.render('alert', {
                user:null,
                message: "Passwords don't match!",
                backURL: "/"
            });
    } else {
        Account.findOne({email:req.body.email}, function(err, results) {
            if(results === null)
            {   
                var newUser = new Account();
                newUser.email = req.body.email;
                newUser.password = newUser.generateHash(req.body.password);
                newUser.save();
                req.login(req.body, function() {
                res.redirect('/profile/edit-profile');
                });
            } else {
                return res.render('alert', {
                user:null,
                message: "Already Registered!",
                backURL: "/"
                });
            }
        });
        
    }
});
authRouter.post('/signIn', function(req, res, next) {
  passport.authenticate('local',  function(err, user, info) {
    if(err) {
        return res.render('alert', {
                user:null,
                message: err,
                backURL: "/"
                }); 
    }
    req.login(user, function() {
     return res.redirect('/profile');
    });        
  })(req, res, next) ;
});
authRouter.get('/logOut', function(req,res) {
    req.logout();
    res.redirect('/');
});

authRouter.get('/facebook', 
  passport.authenticate('facebook', { scope :'email' })
); 
authRouter.get('/facebook/callback',
  passport.authenticate('facebook', {
        successRedirect : '/profile',
        failureRedirect : '/'
    })

);
authRouter.get('/google', 
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.profile',
				 'https://www.googleapis.com/auth/userinfo.email']})

);
authRouter.get('/google/callback',
  passport.authenticate('google', {
    successRedirect : '/profile',
    failureRedirect : '/'
  })
);

module.exports = authRouter;
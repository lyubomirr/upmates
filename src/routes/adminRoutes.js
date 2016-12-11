var express = require('express');
var adminRouter = express.Router();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Account = require("../models/Account");
var Project = require("../models/Project");
var passport = require('passport');

adminRouter.get('/admin-panel-login', function(req,res) {
   res.render('adminPanelLogin'); 
});
adminRouter.get('/admin-panel', function(req,res) {
    if(!req.user) {
        res.redirect('/');
    }
    if(req.user._id != '56db7116bcde9c329c9c98b2') {
        res.redirect('/');
    }
    Account.find({}, function(err, accounts) {
       if(err) console.log(err);
        Project.find({}, function(err2, projects) {
           if(err2) console.log(err2);
            res.render('adminPanel', {
                accounts:accounts,
                projects: projects
            });
        });
    });
});


module.exports = adminRouter;

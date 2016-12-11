var express = require('express');
var profileRouter = express.Router();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var multer = require('multer');
var Account = require("../models/Account");
var Message = require('../models/Message');
var uploading = multer({
  dest: __dirname + '/../../public/uploads/',
  limits: {fileSize: 10000000, files:1}
});

profileRouter.get('/', function(req,res,next) {
    if(!req.user) {
       return res.redirect('/');
    }
    if(req.user.position == undefined) {
        return res.redirect('/profile/edit-profile');
    }
    if(req.user.email == 'admin@admin.com') {
        return res.redirect('/admin/admin-panel');
    }
    Account.findOne({email:req.user.email}, function(err,results) {
        if(err) {
            return res.send(err);
        }
        res.render('profileView.ejs', {
            user: results,
            profile: results
        });
        next(); 
    });
});
profileRouter.get('/id/:profileid', function(req,res) {
    if(req.user.position == undefined) {
        return res.redirect('/profile/edit-profile');
    }
    var id = req.params.profileid;
    Account.findOne({_id:id}, function(err, results) {
        if(err) {
            console.log(err);
            return res.redirect('/');
        }
        if(!results) {
            return res.redirect('/');
        }
       res.render('profileView.ejs', {
           user:req.user,
           profile: results
       }); 
    });
});
profileRouter.post('/id/:profileid/send-message', function(req,res) {
    var id = req.params.profileid;
    Account.findOne({'_id':id}, function(err, receiver) {
        if(err) console.log(err);
        if(id == req.user._id) {
            return res.render('alert', {
                user:req.user,
                message:"You can't send a message to yourself!",
                backURL:"/profile/id/"+id
            });
        }
        var message = new Message({
            sender: {
                id: req.user._id,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                email: req.user.email
            },
            reciever: {
                id: id,
                firstName: receiver.firstName,
                lastName: receiver.lastName,
                email: receiver.email
            },
            title: req.body.title,
            body: req.body.messageBody
        });
        message.save(function(err) {
            if(err) console.log(err);
            res.render('alert', {
                user:req.user,
                message:"You have succesfully send the message!",
                backURL:"/profile/id/"+id
            });
        });
    });
});
profileRouter.post('/id/:profileid/send-message/from-messenger', function(req,res) {
    var id = req.params.profileid;
    Account.findOne({'_id':id}, function(err, receiver) {
        if(err) console.log(err);
        if(id == req.user._id) {
            return res.render('alert', {
                user:req.user,
                message:"You can't send a message to yourself!",
                backURL:"/profile/id/"+id
            });
        }
        var message = new Message({
            sender: {
                id: req.user._id,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                email: req.user.email
            },
            reciever: {
                id: id,
                firstName: receiver.firstName,
                lastName: receiver.lastName,
                email: receiver.email
            },
            title: req.body.title,
            body: req.body.messageBody
        });
        message.save(function(err) {
            if(err) console.log(err);
            res.render('alert', {
                user:req.user,
                message:"You have succesfully send the message!",
                backURL:"/profile/my-messages"
            });
        });
    });
});
profileRouter.get('/id/:profileid/delete', function(req,res) {
    var id = req.params.profileid;
    if(!req.user) {
        return res.redirect("/");
    }
    if(req.user.email != 'admin@admin.com') {
        return res.redirect("/");
    }
    Account.remove({'_id':id}, function(err) {
        if(err) console.log('err');
        res.redirect('/admin/admin-panel');
    })
    
});
profileRouter.get('/edit-profile', function(req,res) {
    if(!req.user) {
        return res.redirect('/');
    }
    res.render('editprofileView.ejs', {user:req.user}); 
   
});
profileRouter.post('/edit-profile/success', uploading.single('picture'), function(req,res) {
    if(req.body.password != req.body.confirmPassword) {
        return res.render('alert', {
            user:req.user,
            message: "Passwords don't match!",
            backURL: "/profile/edit-profile"
        });
    }
    Account.findOne({email:req.user.email}, function(err, results) {
        if(err) {
            console.log(err);
        }
        results.firstName = req.body.firstName;
        results.lastName = req.body.lastName;
        results.country = req.body.country;
        results.position = req.body.position;
        if(req.body.email != "") results.email = req.body.email;
        if(req.body.password != "") results.password = results.generateHash(req.body.password);
        results.age = req.body.age;
        results.gender = req.body.gender;
        results.education = req.body.education;
        results.city = req.body.city;
        results.phone = req.body.phone;
        results.languages = req.body.languages;
        results.aboutMe = req.body.aboutMe;
        results.skills = req.body.skills;
        results.workTerms = req.body.workTerms;
        var user = results;
        req.login(user, function(err) {
            if(err) console.log(err);
        })
       /* req.user.firstName = req.body.firstName;
        req.user.lastName = req.body.lastName;
        req.user.country = req.body.country;
        req.user.position = req.body.position;
        if(req.body.email != "") req.user.email = req.body.email;
        if(req.body.password != "") req.user.password = req.body.password;
        req.user.age = req.body.age;
        req.user.gender = req.body.gender;
        req.user.education = req.body.education;
        req.user.city = req.body.city;
        req.user.phone = req.body.phone;
        req.user.languages = req.body.languages;
        req.user.aboutMe = req.body.aboutMe;
        req.user.skills = req.body.skills;
        req.user.workTerms = req.body.workTerms;
      */
        if(req.file) {
            results.imageURL = "/uploads/"+req.file.filename;
        }
        results.save(function(err) {
            console.log(err);
            res.redirect("/profile");
        });
    });
});
profileRouter.get('/my-messages', function(req,res) {
   if(req.user.position == undefined) {
       return res.redirect('/profile/edit-profile');
   }
   Message.find({'reciever.id':req.user._id}).sort({'dateSent':-1}).exec(function(err, messages) {
       res.render('myMessages',{
           user:req.user,
           messages: messages
       });
   });
});
profileRouter.get('/sent-messages', function(req,res) {
   if(req.user.position == undefined) {
       return res.redirect('/profile/edit-profile');
   }
   Message.find({'sender.id':req.user._id}).sort({'dateSent':-1}).exec(function(err, messages) {
       res.render('sentMessages',{
           user:req.user,
           messages: messages
       });
   });
});

module.exports = profileRouter;

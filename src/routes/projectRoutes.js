var express = require('express');
var projectRouter = express.Router();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Account = require("../models/Account");
var Project = require("../models/Project");


projectRouter.get('/my-projects', function(req,res,next) {
    if(!req.user) {
        return res.redirect('/');
    }
    if(req.user.position == undefined) {
        return res.redirect('/profile/edit-profile');
    }
    res.render('myProjects', {
        user:req.user
    });
(req,res,next);
});
projectRouter.get('/id/:projectid', function(req,res,next) {
    if(req.user.position == undefined) {
        return res.redirect('/profile/edit-profile');
    }
    var id = req.params.projectid;
    Project.findOne({'_id':id}, function(err, project) {
        if(err) {
            console.log(err);
            return res.redirect('/');
        }
       Account.findOne({'_id':project.poster.id}, function(err, poster) {
           if(err) {
                console.log(err);
                return res.redirect('/');
           }
           res.render('projectView', {
               user:req.user,
               project:project,
               poster:poster
               
           });
       });
    });
});
projectRouter.get('/id/:projectid/work-page', function(req,res,next) {
    if(req.user.position == undefined) {
        return res.redirect('/profile/edit-profile');
    }
    var id = req.params.projectid;
    Project.findOne({'_id':id, 'members.id': req.user._id}, function(err, results) {
       if(!results) {
           return res.redirect('/');
        } else {
           return res.render('workPage', {
            user: req.user,
            project: results 
           });
        }
    });
});
projectRouter.get('/id/:projectid/delete', function(req,res) {
    var id = req.params.projectid;
    if(!req.user)  {
        return res.redirect("/");
    }
    if(req.user.email == 'admin@admin.com' ) {
        Project.remove({'_id':id}, function(err) {
            if(err) console.log('err');
            return res.redirect('/admin/admin-panel');
        });
    } else {
        Project.findOne({'_id':id}, function(err, results) {
            if(req.user._id == results.poster.id) {
                Project.remove({'_id':id}, function(err) {
                    if(err) console.log('err');
                    return res.redirect('/project/current-projects');
                });
            } else {
                return res.redirect('/')
            }
        });                                
    }
});
projectRouter.get('/apply/:projectid', function(req,res,next) {
    if(!req.user) {
        res.redirect('/');
    }
    var id = req.params.projectid;
    Project.findOne({"_id":id}, function(err, project) {
        if(err) {
            console.log(err);
            return res.redirect('/');
        }
        for(var i = 0; i < project.applicants.length; i++) {
            if(project.applicants[i].id == req.user._id) {
                return res.render('alert', {
                    user:req.user,
                    message: "You have already applied!",
                    backURL: "/project/id/" + id
                });
            }
        }
        project.applicants.push({
            id: req.user._id,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            imageURL: req.user.imageURL
        });
        project.save(function(err) {
            return res.render('alert', {
                user:req.user,
                message: "You have successfully applied!",
                backURL: "/project/id/" + id
            });
        })
        
    });
});
projectRouter.get('/id/:projectid/accept/:profileid', function(req,res) {
    if(!req.user) {
        res.redirect('/');
    }
    var projectid = req.params.projectid;
    var profileid = req.params.profileid;
    Project.findOne({"_id":projectid}, function(err, project) {
        if(err) {
            console.log(err);
            return res.redirect('/');
        }
        for(var  i = 0; i < project.applicants.length; i++) {
            if(project.applicants[i].id == profileid) {
                project.members.push({
                    id:profileid,
                    firstName: project.applicants[i].firstName,
                    lastName: project.applicants[i].lastName,
                    imageURL: project.applicants[i].imageURL
                });
                project.applicants.pull(project.applicants[i]._id);
                break;
            }
        }
        project.save(function(err) {
            if(err) {
                console.log(err);
            }
            return res.redirect('/project/my-applicants');
        })      
    });
});
projectRouter.get('/id/:projectid/reject/:profileid', function(req,res) {
    if(!req.user) {
        res.redirect('/');
    }
    var projectid = req.params.projectid;
    var profileid = req.params.profileid;
    Project.findOne({"_id":projectid}, function(err, project) {
        if(err) {
            console.log(err);
            return res.redirect('/');
        }
        for(var  i = 0; i < project.applicants.length; i++) {
            if(project.applicants[i].id == profileid) {
                project.applicants.pull(project.applicants[i]._id);
            }
        }
        project.save(function(err) {
            if(err) {
                console.log(err);
            }
            res.redirect('/project/my-applicants');
        })      
    });
});
projectRouter.get('/id/:projectid/kick/:profileid', function(req,res) {
   if(!req.user) {
       return res.redirect('/');
   }
   var projectid = req.params.projectid;
   var profileid = req.params.profileid;
    Project.findOne({"_id":projectid}, function(err, project) {
        if(err) console.log(err);
        if(project.poster.id == req.user._id || profileid == req.user._id) {
            for( var i = 0; i < project.members.length; i++) {
                if(project.members[i].id == profileid) {
                    project.members.pull(project.members[i]._id);
                }
            }
        }
        project.save(function(err) {
            if(err) console.log(err);
            return res.redirect('/project/id/' + projectid + '/work-page');
        })
    });
});
projectRouter.post('/id/:projectid/todo/add', function(req,res) {
    if(!req.user) {
        res.redirect('/');
    }
    var projectid = req.params.projectid;
    Project.findOne({'_id':projectid}, function(err, project) {
        if(err) console.log(err);
        project.todo.push({
            body: req.body.body,
            postedBy: req.user.firstName + " " + req.user.lastName
        });    
        project.save(function(err) {
            if(err) console.log(err);
            res.redirect('/project/id/'+ project._id + '/work-page');
        });
    });
});
projectRouter.post('/id/:projectid/doing/add', function(req,res) {
    if(!req.user) {
        res.redirect('/');
    }
    var projectid = req.params.projectid;
    Project.findOne({'_id':projectid}, function(err, project) {
        if(err) console.log(err);
        project.doing.push({
            body: req.body.body,
            postedBy: req.user.firstName + " " + req.user.lastName,
            takenBy: req.user.firstName + " " + req.user.lastName,
            takenById: req.user._id,
            progress: 0
        });    
        project.save(function(err) {
            if(err) console.log(err);
            res.redirect('/project/id/'+ project._id + '/work-page');
        });
    });
});
projectRouter.post('/id/:projectid/done/add', function(req,res) {
    if(!req.user) {
        res.redirect('/');
    }
    var projectid = req.params.projectid;
    Project.findOne({'_id':projectid}, function(err, project) {
        if(err) console.log(err);
        project.done.push({
            body: req.body.body,
            postedBy: req.user.firstName + " " + req.user.lastName,
            takenBy: req.user.firstName + " " + req.user.lastName
        });
        project.save(function(err) {
            if(err) console.log(err);
            res.redirect('/project/id/'+ project._id + '/work-page');
        });
    });
});
projectRouter.get('/id/:projectid/remove/:taskid', function(req,res) {
    if(!req.user) {
        return res.redirect('/');
    }
    var projectid = req.params.projectid;
    var taskid = req.params.taskid;
    
    Project.findOne({'_id':projectid}, function(err, project) {
        if(err) console.log(err);
        for( var i = 0; i < project.todo.length; i++ ) {
            if( taskid == project.todo[i]._id ) {
                project.todo.pull({
                    _id:project.todo[i]._id
                });
                project.save(function(err) {
                    if(err) console.log(err);
                    return res.redirect('/project/id/'+ project._id + '/work-page');
                });
            }   
        }
        for( var i = 0; i < project.doing.length; i++ ) {
            if( taskid == project.doing[i]._id ) {
                project.doing.pull({
                    _id:project.doing[i]._id
                });
                project.save(function(err) {
                    if(err) console.log(err);
                    return res.redirect('/project/id/'+ project._id + '/work-page');
                });
            }   
        }
        for( var i = 0; i < project.done.length; i++ ) {
            if( taskid == project.done[i]._id ) {
                project.done.pull({
                    _id:project.done[i]._id
                });
                project.save(function(err) {
                    if(err) console.log(err);
                    return res.redirect('/project/id/'+ project._id + '/work-page');
                });
            }      
        }     
    });
});
projectRouter.get('/id/:projectid/right/:taskid', function(req,res) {
    if(!req.user) {
        return res.redirect('/');
    }
    var projectid = req.params.projectid;
    var taskid = req.params.taskid;
    
    Project.findOne({'_id':projectid}, function(err, project) {
        if(err) console.log(err);
        for( var i = 0; i < project.todo.length; i++ ) {
            if( taskid == project.todo[i]._id ) {
                project.doing.push({
                   body: project.todo[i].body,
                   postedBy: project.todo[i].postedBy,
                   takenBy: req.user.firstName + " " + req.user.lastName,
                   takenById: req.user._id,
                   progress: 0
                });
                project.todo.pull({
                    _id:project.todo[i]._id
                });
                project.save(function(err) {
                    if(err) console.log(err);
                    return res.redirect('/project/id/'+ project._id + '/work-page');
                });
            }   
        }
        for( var i = 0; i < project.doing.length; i++ ) {
            if( taskid == project.doing[i]._id ) {
                project.done.push({
                    body: project.doing[i].body,
                    postedBy: project.doing[i].postedBy,
                    takenBy: project.doing[i].takenBy
                })
                project.doing.pull({
                    _id:project.doing[i]._id
                });
                project.save(function(err) {
                    if(err) console.log(err);
                    return res.redirect('/project/id/'+ project._id + '/work-page');
                });
            }   
        }    
    });
});
projectRouter.get('/id/:projectid/left/:taskid', function(req,res) {
    if(!req.user) {
        return res.redirect('/');
    }
    var projectid = req.params.projectid;
    var taskid = req.params.taskid;
    
    Project.findOne({'_id':projectid}, function(err, project) {
        if(err) console.log(err);
        for( var i = 0; i < project.doing.length; i++ ) {
            if( taskid == project.doing[i]._id ) {
                project.todo.push({
                    body: project.doing[i].body,
                    postedBy: project.doing[i].postedBy
                })
                project.doing.pull({
                    _id:project.doing[i]._id
                });
                project.save(function(err) {
                    if(err) console.log(err);
                    return res.redirect('/project/id/'+ project._id + '/work-page');
                });
            }   
        }
        for( var i = 0; i < project.done.length; i++ ) {
            if( taskid == project.done[i]._id ) {
                project.doing.push({
                    body: project.done[i].body,
                    postedBy: project.done[i].postedBy,
                    takenBy: project.done[i].takenBy,
                    takenById: req.user._id,
                    progress: 0
                });
                project.done.pull({
                    _id:project.done[i]._id
                });
                project.save(function(err) {
                    if(err) console.log(err);
                    return res.redirect('/project/id/'+ project._id + '/work-page');
                });
            }   
        }
    });
});
projectRouter.post('/id/:projectid/submit-progress/:taskid', function(req,res) {
    if(!req.user) {
        return res.redirect('/');
    }
    var projectid = req.params.projectid;
    var taskid = req.params.taskid;
    Project.findOne({'_id':projectid}, function(err, project) {
        if(err) console.log(err);
        for( var i = 0; i < project.doing.length; i++ ) {
            if( taskid == project.doing[i]._id ) {
                project.doing[i].progress = req.body.progress;
            }   
        }
        project.save(function(err) {
            if(err) console.log(err);
            return res.redirect('/project/id/'+ project._id + '/work-page');
        })
    });
});
projectRouter.get('/share-idea', function(req,res) {
    if(!req.user) {
        return res.render('alert', {
           user: null,
           message: "To see this you need to be logged in!",
           backURL: "/"
        });
    }
    if(req.user.position == undefined) {
        return res.redirect('/profile/edit-profile');
    }
    res.render('shareIdeaView', {
       user: req.user
    });
});
projectRouter.post('/share-idea/success', function(req,res) {
  if(!req.user) {
        return res.redirect('/');
    }
    var project = new Project({
        title: req.body.title,
         info: req.body.info,
         positionsRequired: {
             programmer: req.body.programmer,
             designer: req.body.designer,
             marketingManager: req.body.marketingManager,
             qualityAssurance: req.body.qualityAssurance,
             teamLeader: req.body.teamLeader,
             businessAnalyst: req.body.businessAnalyst,
             other: req.body.other
         },
         skills: req.body.skillsRequired,
         poster: {
             id: req.user._id,
             firstName: req.user.firstName,
             lastName: req.user.lastName,
             imageURL: req.user.imageURL
         }
    });
    project.members.push({
        id: req.user._id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        imageURL: req.user.imageURL
    });
    project.save(function(err) {
        if(err) console.log(err);
        res.redirect('/project/id/'+ project._id);
    });
   
});
projectRouter.get('/find-work', function(req,res) {
    if(!req.user) {
        return res.render('alert', {
           user: null,
           message: "To see this you need to be logged in!",
           backURL: "/"
        });
    }
    if(req.user.position == undefined) {
        return res.redirect('/profile/edit-profile');
    }
    Project.find().exec(function(err, results) {
        res.render('findWork', {
            user:req.user,
            projects: results
        });   
    });
    
});
projectRouter.post('/find-work/success', function(req,res) {
    if(req.body.content == '' && req.body.skills == '') {
        Project.find().exec(function(err, results) {
            if(err) {
                    console.log(err);
            }
            res.render('findWork', {
                user:req.user,
                projects: results
            });   
        });
    }
    else {
        Project.find({$text: {$search: req.body.content + req.body.skills} }).exec(function(err,results) {
                if(err) {
                    console.log(err);
                }
                res.render('findWork', {
                   user:req.user,
                   projects: results
                });
        });
    }
});
projectRouter.get('/my-applications', function(req,res) {
    if(!req.user) {
        res.redirect('/');
    }
    if(req.user.position == undefined) {
        return res.redirect('/profile/edit-profile');
    }
    Project.find({'applicants.id': req.user._id}, function(err, results) {
        res.render('myApplications', {
            user: req.user,
            projects: results
        });   
    });
});
projectRouter.get('/my-applicants', function(req,res) {
   if(!req.user) {
       return res.redirect('/');
   }
   if(req.user.position == undefined) {
       return res.redirect('/profile/edit-profile');
   }
    Project.find({'poster.id': req.user._id}, function(err, results) {
        res.render('myApplicants', {
            user: req.user,
            projects: results
        });   
    });
});
projectRouter.get('/current-projects', function(req,res) {
    if(!req.user) {
        return res.redirect('/');
    }
    if(req.user.position == undefined) {
        return res.redirect('/profile/edit-profile');
    }
    Project.find({'members.id':req.user._id}, function(err, projects) {
        if(err) {
            console.log(err);
        }
        res.render('currentProjects', {
            user:req.user,
            projects:projects
        });
    });
});
module.exports = projectRouter;

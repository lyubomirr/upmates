var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var Account = require('../../models/Account');

module.exports = function() {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    function(username, password, done) {
        Account.findOne({email:username},
            function(err,results) {
                if(err) {
                    done(err);
                }
                if(!results) {
                    done('There is no such account registered!', null);
                } else if(results.fb.id != null && results.password == "") {
                    done('Login with your facebook account', null);
                } else if(!results.validPassword(password)) {
                    done('Wrong Password', null);
                } else {
                   var user = results;
                    done(null, user);
                }
            });
    })); 
};
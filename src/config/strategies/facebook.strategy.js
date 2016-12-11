var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var Account = require('../../models/Account');

module.exports = function() {
    passport.use(new FacebookStrategy({
        clientID: 213468432339084,
        clientSecret: "1ba392877f858b5d2045d06106e2c21d",
        callbackURL: "http://upmates.net/auth/facebook/callback",
        profileFields: ['id', 'name', 'emails']
    },
    function(accessToken, refreshToken, profile, cb) {
        Account.findOne({'fb.id': profile.id }, function (err, user) {
            if (err) {
                return cb(err);
            }
            if(user) {
                return cb(null,user);
            }
            else {
               var newAcc = new Account({
                    fb: {
                        id: profile.id,
                        access_token: accessToken
                    },
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName,
                    email: profile.emails[0].value,
                    imageURL: "https://graph.facebook.com/" + profile.id + "/picture?type=large",
                });
                newAcc.save(function(err) {
                    if(err) throw err;
                });
                return cb(null, newAcc);   
                
            }
        });
    }));    
};

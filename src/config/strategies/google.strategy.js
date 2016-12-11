var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth2').Strategy;
var Account = require('../../models/Account');

module.exports = function() {
    passport.use(new GoogleStrategy({
        clientID: "629190975942-okn1iq4sfi1amgjifps7p7s2dlnbsmk7.apps.googleusercontent.com",
        clientSecret: "JhRSY-n0_KK97L4-jZ21meZv",
        callbackURL: "http://upmates.net/auth/google/callback",
        passReqToCallback:true
    },
    function(accessToken, refreshToken, profile, cb) {
        Account.findOne({'google.id': profile.id }, function (err, user) {
            if (err) {
                return cb(err);
            }
            if(user) {
                return cb(null,user);
            }
            else {
               console.log(profile);
               var newAcc = new Account();
                newAcc.google.id = profile.id;
                newAcc.google.access_token = accessToken;
                newAcc.firstName = profile.name.givenName;
                newAcc.lastName = profile.name.familyName;
                newAcc.email = profile.emails[0].value;
                newAcc.imageURL = profile._json.image.url;
                newAcc.save(function(err) {
                    if(err) console.log(err);
                    return cb(null, newAcc); 
                });
                 
                
            }
        });
    }));    
};

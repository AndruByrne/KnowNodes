(function () {
    var passport = require('passport'),
        FacebookStrategy = require('passport-facebook').Strategy,
        GoogleStrategy = require('passport-google').Strategy,
        LocalStrategy = require('passport-local').Strategy,

        DB = require('../DB/knownodeDB'),

        basicURL = 'http://knownode.eu01.aws.af.cm/',
        //basicURL = 'http://localhost:3000/',

        FACEBOOK_APP_ID = "138799776273826",
        FACEBOOK_APP_SECRET = "6e3e885f57d1eaaca309509a7e86479a";

    function findByEmail(email, profile, fn) {
        DB.User.all({ where: { email: email }}, function(err, user) {
            if(err) {
                return fn(err, profile);
            }
            return fn(err, user);
        });
    }

    exports.initializePassport = function () {
        passport.serializeUser(function (user, done) {
            done(null, user);
        });

        passport.deserializeUser(function (obj, done) {
            done(null, obj);
        });


        passport.use(new LocalStrategy(
            function(email, password, done) {
                findByEmail(email, function (err, user) {
                    if (err) { return done(err); }
                    if (!user) { return done(null, false); }
                    if (user.password != password) { return done(null, false); }
                    return done(null, user);
                });
            }
        ));

        passport.use(new FacebookStrategy({
                clientID: FACEBOOK_APP_ID,
                clientSecret: FACEBOOK_APP_SECRET,
                callbackURL: basicURL + "auth/facebook/callback"
            },

            function (accessToken, refreshToken, profile, done) {
                if(profile.emails && profile.emails.length > 0){
                    findByEmail(profile.emails[0], profile, function(err, user){
                        if(err)
                        {
                            return DB.User.create({
                                email: user.emails[0].value,
                                firstName: user.first_name,
                                lastName: user.last_name,
                                origin: 'facebook'
                            }, done);
                        }

                        return done(null, profile);
                    });
                }
                return done(null, profile);
        }));

        passport.use(new GoogleStrategy({
                returnURL: basicURL + 'auth/google/callback',
                realm: basicURL
            },
            function(identifier, profile, done) {
                // asynchronous verification, for effect...
                console.log('arrived');
                process.nextTick(function () {

                    profile.identifier = identifier;

                    if(profile.emails && profile.emails.length > 0){
                        findByEmail(profile.emails[0].value, profile, function(err, user){
                            if(err)
                            {
                                return DB.User.create({
                                    email: user.emails[0].value,
                                    firstName: user.name.givenName,
                                    lastName: user.name.familyName,
                                    origin: 'google'
                                }, done);
                            }

                            profile = user[0];
                            profile.identifier = identifier;

                            return done(null, profile);
                        });
                    }

                    return done(null, profile);
                    /*

                    User.findByOpenID({ openId: identifier }, function (err, user) {
                        return done(err, user);
                    });
                    */
                });
            }
        ));
    }
}).call(this);
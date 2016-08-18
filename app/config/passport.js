//Configuration module for Passport 
//For more info: http://passportjs.org/docs/configure

var path = process.cwd();

var LocalStrategy = require('passport-local').Strategy;
var User = require(path+'/app/models/user');

module.exports=function(passport){
        //session use
        passport.serializeUser(function(user, done) {
          done(null, user.id);
        });
        //session use
        passport.deserializeUser(function(id, done) {
          User.findById(id, function(err, user) {
            done(err, user);
          });
        });
        //local strategy
        passport.use(new LocalStrategy(
          function(username, password, done) {
            User.findOne({ 'user.username': username }, function(err, user) {
              if (err) { return done(err); }
              if (!user) {
                console.log("message: 'Incorrect username.'");
                return done(null, false);
              }
              if (user['user']['password']!==password) {
                console.log("message: 'Incorrect password.'");
                return done(null, false);
              }
              return done(null, user);
            });
          }
        ))
        
};
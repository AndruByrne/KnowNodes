// Generated by CoffeeScript 1.4.0
(function() {
  var LogModule;

  LogModule = require('../modules/log');

  module.exports = {
    isAdmin: function(request, response, next) {
      console.log("checking it's admin");
      return next();
      /*
      		if([1,2,3].indexOf(request.params.article) >= 0) {
      		next()
      		} else {
      		response.redirect('/articles')
      		}
      */

    },
    isLoggedIn: function(request, response, next) {
      console.log("checking if user is loggedin");
      return next();
    },
    callBack: function(res) {
      return function(err, result) {
        if (err) {
          return res.json({
            error: err
          });
        } else {
          return res.json({
            success: result
          });
        }
      };
    },
    logActivity: function(user, title, description, callback) {
      var logger;
      logger = new LogModule(user);
      return logger.logActivity(title, description, callback);
    }
  };

}).call(this);
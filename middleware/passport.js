const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const authController = require("../controller/Account_controller");
const localLogin = new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    (email, password, done) => {
      // console.log(email);
      // console.log(password);
      const user = authController.getUserByEmailIdAndPassword(email, password);
      return user
        ? done(null, user)
        : done(null, false, {
            message: "Your login details are not valid. Please try again",
          });
    }
  ); 

passport.serializeUser(function (user, done) {
    done(null, user.id);
});
  
passport.deserializeUser(function (id, done) {
    let user = authController.getUserById(id);
    if (user) {
      done(null, user)
    } else {
      done({ message: "User not found" }, null);
    } 
});
  
module.exports = passport.use(localLogin);
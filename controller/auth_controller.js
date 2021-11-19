let database = require("../database");
const userModel = require("../database").userModel;
const passport = require("../middleware/passport");

let authController = {
  login: (req, res) => {
    res.render("auth/login");
  },

  register: (req, res) => {
    res.render("auth/register");
  },

  loginSubmit:
    
    passport.authenticate("local", {
      successRedirect: "/reminders",
      failureRedirect: "/login",
    }),
 
  registerSubmit: (req, res) => {
    // implement
  },
};

module.exports = authController;

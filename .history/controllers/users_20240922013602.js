const User = require("../models/user");
const passport = require("passport");


//Go to local log in page
module.exports.renderLogin = (req, res) => {
   res.render("users/login");
};

//Go to Google log in page
module.exports.renderGoogleLogin = (req,res) =>{
  passport.authenticate("google", { scope: ["profile", "email"] })
}


//Go to sign up page
module.exports.renderRegister = (req, res) => {
  res.render("users/register");
};

//Set log in
module.exports.login = (req, res) => {
  req.flash("success", "welcome back!");
  const redirectUrl = req.session.returnTo || "/";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};


//Set sign up
module.exports.register = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to lovely meng's home!");
      res.redirect("/");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};



module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Goodbye!");
    res.redirect("/");
  });
  // req.session.destroy();
};

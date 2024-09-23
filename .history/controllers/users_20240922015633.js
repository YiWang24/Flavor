const User = require("../models/user");
const passport = require("passport");

//Go to local log in page
module.exports.renderLogin = (req, res) => {
  res.render("users/login");
};

//Go to Google log in page
module.exports.renderGoogleLogin = passport.authenticate("google", {
  scope: ["profile", "email"],
});

module.exports.renderGoogleLoginCB = (req, res, next) => {
  passport.authenticate("google", { failureRedirect: "/login" })(
    req,
    res,
    (err) => {
      if (err) {
        return next(err); // 如果有错误，传递给下一个中间件
      }
      // 成功认证后执行的代码
      req.flash("success", "Welcome back!");
      const redirectUrl = req.session.returnTo || "/";
      delete req.session.returnTo;
      res.redirect(redirectUrl);
    }
  );
};

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

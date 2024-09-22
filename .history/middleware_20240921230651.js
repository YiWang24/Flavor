const ExpressError = require("./utils/ExpressError");
const Menu = reqruire("./models/menu");
const { menuSchema } = require("./schemas.js");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "Please log in first");
    return res.redirect("/login");
  }
  next();
};

module.exports.isAuthor = async (req, res, next) => {
  const menu = await Menu.findById(req.params.id).populate("Type");
  if (!menu.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect(`/menus/${menu.type.typeCode}`);
  }
  next();
};

module.exports.validateMenu = (req, res, next) => {
  const { error } = menuSchema.validate(req.body);
  console.log(req.body);
  if(error)
};

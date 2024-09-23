const ExpressError = require("./utils/ExpressError");
const Menu = require("./models/menu");
const Review = require("./models/review");
const { menuSchema } = require("./schemas.js");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    console.log(`Setting returnTo: ${req.originalUrl}`);
    req.session.returnTo = req.originalUrl;
    req.flash("error", "Please log in first");
    return res.redirect("/login");
  }
  next();
};

module.exports.isAuthor = async (req, res, next) => {
  const menu = await Menu.findById(req.params.id).populate("type");
  if (!menu.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect(`/menus/${menu.type.typeCode}`);
  }
  next();
};

module.exports.validateMenu = (req, res, next) => {
  const { error } = menuSchema.validate(req.body);
  console.log(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect(`/menus/${id}`);
  }
  next();
};

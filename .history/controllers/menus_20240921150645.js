const Menu = require("../models/menu");
const Image = require("../models/image");
const Type = require("../models/type");
const Review = require("../models/review");

//display app menu page
module.exports.renderTypeIndex = async (req, res) => {
  const types = await Type.find({}).populate("images");
  res.render("menus/type", { types });
};

//display selected type menu
module.exports.renderMenuIndex = async (req, res) => {
  const menus = await Menu.find({
    type: await Type.findOne({ typeCode: req.query.typeCode }),
  })
    .populate("type")
    .populate("author")
    .populate("images");
  if (!menus) {
    req.flash("error", "Ops! Cannot find that menu!");
    return res.redirect("/menus");
  }

  res.render("menus/index", { menus });
};

//display one selected menu
module.exports.renderMenu = async (req, res) => {
  const menu = await Menu.findById(req.params.id)
    .populate("type")
    .populate("author")
    .populate("images");
  if (!menu) {
    req.flash("error", "Ops! Cannot find that menu!");
    return res.redirect("/menus");
  }
  res.render("menus/show", { menu });
};

//display new menu page
module.exports.renderNewForm = async (req, res) => {
  res.render("menus/new");
};

//display edit menu page
module.exports.renderEditForm = async (req, res) => {
  const menu = await Menu.findById(req.params.id)
    .populate("type")
    .populate("author")
    .populate("images");
  if (!menu) {
    req.flash("error", "Ops! Cannot find that menu");
    return res.redirect("/menus");
  }
  res.render("menus/edit", { menu });
};

//create new menu post
module.exports.createMenu = async (req, res) => {
  //create a menu
  const menu = new Menu(req.body.menu);
  //create all images
  const imgs = req.files.map((f) => ({
    imageUrl: "/" + f.path,
    imageName: f.filename,
    userId: req.user._id,
  }));
  //save images
  const images = await Promise.all(
    imgs.map(async (img) => {
      return await new Image(img).save();
    })
  );
  menu.images = images.map((image) => image._id);
  menu.author = req.user._id;
  //find and save type
  const type = await Type.findOne({ typeCode: req.body.type.typeCode });
  if (type) {
    menu.type = type._id;
  } else {
    req.flash("error", "Invalid menu type");
    return res.redirect("/menus/new");
  }
  await menu.save();
  req.flash("success", "Congrats, you have create a new menu");
  res.redirect(`/menus/${menu.type.typeCode}/${menu._id}`);
};

//Update a exist menu
module.exports.updateMenu = async (req, res) => {
  //create a menu
  const menu = await Menu.findByIdAndUpdate(req.params.id, {
    ...req.body.menu,
  });
  //create all images
  if (req.files && req.files.length) {
    const imgs = req.files.map((f) => ({
      imageUrl: "/" + f.path,
      imageName: f.filename,
      userId: req.user._id,
    }));
    //save images
    const images = await Promise.all(
      imgs.map(async (img) => {
        return await new Image(img).save();
      })
    );
    menu.images.push(images.map((image) => image._id));
  }
  //find and save type
  const type = await Type.findOne({ typeCode: req.body.type.typeCode });
  if (type) {
    menu.type = type._id;
  } else {
    req.flash("error", "Invalid menu type");
    return res.redirect(`/menus/${menu.type.typeCode}/${menu._id}/`);
  }
  await menu.save();
  if (req.body.deleteImages) {
    if (menu.images.length > req.body.deleteImages.length) {
      await menu.updateOne({
        $pull: { images: { $in: req.body.deleteImages } },
      });
    } else {
      req.flash(
        "error",
        "You cannot delete all images. At least one image must remain."
      );
      return res.redirect(`/menus/${menu.type.typeCode}/${menu._id}/edit`);
    }
  }
  req.flash("success", "Congrats, you successfully updated menu!");
  res.redirect(`/menus/${type.typeCode}/${menu._id}`);
};

//Delete a exist menu
module.exports.deleteMenu = async (req, res) => {
  await Menu.findByIdAndDelete(req.params.id);
  req.flash("success", "Sorry to hear that you delete the menu");
  res.redirect(`/menus/${Menu.type.typeCode}`);
};

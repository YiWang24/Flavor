const express = require("express");
const router = express.Router();
const menus = require("../controllers/menus");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAuthor, validateMenu } = require("../middleware");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + "." + file.mimetype.split("/")[1]
    );
  },
});
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/gif", "image/png", "image/jpeg", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
};
const upload = multer({ storage: storage, fileFilter: fileFilter });

//Go to main route and create new menu
router
  .route("/")
  .get(catchAsync(menus.renderTypeIndex))
  .post(isLoggedIn,upload.array("image"), validateMenu,catchAsync(menus.createMenu));
//Create a new menu
router.route("/new").get(catchAsync(menus.renderNewForm));
//Go to the picked type of  menu
router.route("/:typeCode").get(catchAsync(menus.renderMenuIndex));
//Go to the picked menu

router
  .route("/:typeCode/:id")
  .get(catchAsync(menus.renderMenu))
  .put(isLoggedIn,upload.array("image"),validateMenu, catchAsync(menus.updateMenu))
  .delete(isLoggedIn,isAuthor,catchAsync(menus.deleteMenu));
//edit a exist menu
router.route("/:typeCode/:id/edit").get(isLoggedIncatchAsync(menus.renderEditForm));

module.exports = router;

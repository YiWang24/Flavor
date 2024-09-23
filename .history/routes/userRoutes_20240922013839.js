const express = require("express");
const router = express.Router();
const passport = require("passport");
const users = require("../controllers/users");
const catchAsync = require("../utils/catchAsync");

//google login in
router.route("/auth/google").get(users.renderGoogleLogin);

router.route("/auth/google/callback").get(users.renderGoogleLoginCB);

//local login
router
  .route("/register")
  .get(users.renderRegister)
  .post(catchAsync(users.register));

router
  .route("/login")
  .get(users.renderLogin)
  .post(
    users.
  );

router.get("/logout", users.logout);

module.exports = router;

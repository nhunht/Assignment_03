var express = require("express");
var indexController = require("../controllers/indexController");
const passport = require("passport");
var router = express.Router();

/* GET home page. */
router.route("/").get(indexController.index);
router
  .route("/register")
  .get(indexController.regist)
  .post(indexController.signup);
router
  .route("/login")
  .get(indexController.login)
  .post(
    passport.authenticate("local", {
      failureRedirect: "/login",
      successRedirect: "/",
    }),
    indexController.signin
  );
router
  .route("/forgot-password/")
  .get(indexController.formForgotPassword)
  .post(indexController.forgotPassword);
router
  .route("/forgot-password/:token")
  .get(indexController.formForgotPassword)
  .post(indexController.resetPassword);

module.exports = router;

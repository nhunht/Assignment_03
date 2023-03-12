const express = require('express');
const userController = require('../controllers/userController');
const userRouter = express.Router();
const passport = require('passport');
const utils = require('../auth/utils');

userRouter.route('/')
  .get((req, res, next) => {
    req.isAuthenticated() ? next() : res.redirect('/users/login')
  }, userController.index)
userRouter.route('/register')
  .get(userController.regist)
  .post(userController.signup)
userRouter.route('/login')
  .get(userController.login)
  .post(passport.authenticate('local', {
    failureRedirect: '/users/login',
    successRedirect: '/',
  }), userController.signin)
userRouter.route('/edit/:userId')
  .get(utils.checkNotAdmin, userController.formEdit)
  .post(utils.checkNotAdmin, userController.edit)

module.exports = userRouter;
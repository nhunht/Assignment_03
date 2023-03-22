const express = require('express');
const userController = require('../controllers/userController');
const userRouter = express.Router();
const utils = require('../auth/utils');

userRouter.route('/')
  .get((req, res, next) => {
    req.isAuthenticated() ? next() : res.redirect('/login')
  }, userController.index)
userRouter.route('/edit/:userId')
  .get(utils.checkNotAdmin, userController.formEdit)
  .post(utils.checkNotAdmin, userController.edit)

module.exports = userRouter;
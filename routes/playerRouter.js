const express = require('express');
const playerController = require('../controllers/playerController')
const playersRouter = express.Router();
const utils = require('../auth/utils');

playersRouter.route('/')
    .get((req, res, next) => {
        req.isAuthenticated() ? next() : res.redirect('/users/login')
    }, playerController.index)
    .post(utils.checkIsAdmin, playerController.create);
playersRouter.route('/edit/:playerId')
    .get(utils.checkIsAdmin, playerController.formEdit)
    .post(utils.checkIsAdmin, playerController.edit);
playersRouter.route('/delete/:playerId') 
    .get(utils.checkIsAdmin, playerController.delete)
    
module.exports = playersRouter;

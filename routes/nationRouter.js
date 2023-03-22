const express = require('express');
const nationController = require('../controllers/nationController')
const nationsRouter = express.Router();
const utils = require('../auth/utils');

nationsRouter.route('/')
    .get((req, res, next) => {
        req.isAuthenticated() ? next() : res.redirect('/login')
    }, nationController.index)
    .post(utils.checkIsAdmin, nationController.create);
nationsRouter.route('/edit/:nationId')
    .get(utils.checkIsAdmin, nationController.formEdit)
    .post(utils.checkIsAdmin, nationController.edit);
nationsRouter.route('/delete/:nationId') 
    .get(utils.checkIsAdmin, nationController.delete);
nationsRouter.route('/page/:num')
    .get(nationController.paged)
    
module.exports = nationsRouter;

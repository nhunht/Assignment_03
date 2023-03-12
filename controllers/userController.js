const bcrypt = require('bcrypt');
const User = require('../models/user');

class UserController {
    index(req, res, next) {
        let param = {}

        if (!req.user.isAdmin) {
            param = {
                _id: req.user._id
            }
        }

        User.find(param)
            .then((users) => {
                res.render('users', {
                    title: 'Users',
                    users: users,
                    button: req.isAuthenticated() ? 'Logout' : 'Login',
                });
            }).catch(next);
    }

    regist(req, res, next) {
        res.render('register')
    }

    signup(req, res, next) {
        let password = req.body.password;
        req.body.password = bcrypt.hashSync(req.body.password, 10);
        User.register(new User(req.body), password, (err, user) => {
            if (err) {
                console.log(err);
                res.redirect('/users/register')
            } else {
                res.send('<script>alert("Register success!"); window.location.href="/users/login";</script>');
            }
        })
    }

    login(req, res, next) {
        // Check req.user present do logout
        if (req.user) {
            req.logout((err) => {
                if (err) {
                    return next(err);
                } else {
                    res.redirect('/')
                }
            });
        } else {
            res.render('login', {
                title: 'Login Page'
            })
        }


    }

    signin(err, req, res, next) {
        if (err) {
            console.log(err);
            res.redirect('/users/login')
        }
    }

    formEdit(req, res, next) {
        const userId = req.params.userId;
        User.findById(userId)
            .then((user) => {
                res.render('editUser', {
                    title: 'The detail of User',
                    user: user
                })
            })
            .catch(next);
    }

    edit(req, res, next) {
        User.updateOne({
                _id: req.params.userId
            }, req.body)
            .then(() => {
                res.redirect('/users')
            })
            .catch(next);
    }
}
module.exports = new UserController;
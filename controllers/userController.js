const User = require("../models/user");

class UserController {
  index(req, res, next) {
    let param = {};

    if (!req.user.isAdmin) {
      param = {
        _id: req.user._id,
      };
    }

    User.find(param)
      .then((users) => {
        res.render("users", {
          title: "Users",
          users: users,
          button: req.isAuthenticated() ? "Logout" : "Login",
        });
      })
      .catch(next);
  }

  formEdit(req, res, next) {
    const userId = req.params.userId;
    User.findById(userId)
      .then((user) => {
        res.render("editUser", {
          title: "The detail of User",
          user: user,
        });
      })
      .catch(next);
  }

  edit(req, res, next) {
    User.updateOne(
      {
        _id: req.params.userId,
      },
      req.body
    )
      .then(() => {
        res.redirect("/users");
      })
      .catch(next);
  }
}
module.exports = new UserController();

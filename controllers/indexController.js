const Players = require("../models/player");

class IndexController {
  index(req, res, next) {
    let pageSize = req.query.pageSize || 6;
    let pageIndex = req.query.pageIndex || 1;

    Players.aggregate([
      {
        $lookup: {
          from: "nations",
          localField: "nationId",
          foreignField: "_id",
          as: "nation",
        },
      },
    ])
      .skip((pageIndex - 1) * pageSize)
      .limit(pageSize)
      .exec((err, players) => {
        Players.countDocuments((err, count) => {
          if (err) {
            return next(err);
          }
          res.render("index", {
            title: "Home Page",
            players: players,
            button: req.isAuthenticated() ? "Logout" : "Login",
            count: Math.ceil(count / pageSize),
            pageIndex: pageIndex,
          });
        });
      });
  }
}

module.exports = new IndexController();

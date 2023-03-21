const Nations = require("../models/nation");
const isoCountries = require("i18n-iso-countries");
isoCountries.registerLocale(require("i18n-iso-countries/langs/en.json"));

class NationController {
  index(req, res, next) {
    let pageSize = req.query.pageSize || 10;
    let pageIndex = req.query.pageIndex || 1;

    Nations.find({})
      .skip((pageIndex - 1) * pageSize)
      .limit(pageSize)
      .exec((err, nations) => {
        Nations.countDocuments((err, count) => {
          if (err) {
            return next(err);
          }
          res.render("nations", {
            title: "Nations",
            nations: nations,
            button: req.isAuthenticated() ? "Logout" : "Login",
            isAdmin: req.user.isAdmin ? "" : "hidden",
            count: Math.ceil(count / pageSize),
            pageIndex: pageIndex,
          });
        });
      });
  }

  create(req, res, next) {
    const nation = new Nations(req.body);
    nation.ensign =
      "https://flagcdn.com/160x120/" +
      isoCountries.getAlpha2Code(nation.name, "en").toLowerCase() +
      ".png";
    nation
      .save()
      .then(() => res.redirect("/nations"))
      .catch((error) => {});
  }

  formEdit(req, res, next) {
    const nationId = req.params.nationId;
    Nations.findById(nationId)
      .then((nation) => {
        res.render("editNation", {
          title: "The detail of Nation",
          nation: nation,
        });
      })
      .catch(next);
  }

  edit(req, res, next) {
    var code = isoCountries.getAlpha2Code(req.body.name, "en").toLowerCase();
    req.body.ensign = "https://flagcdn.com/160x120/" + code + ".png";
    Nations.updateOne(
      {
        _id: req.params.nationId,
      },
      req.body
    )
      .then(() => {
        res.redirect("/nations");
      })
      .catch(next);
  }

  delete(req, res, next) {
    Nations.deleteOne(
      {
        _id: req.params.nationId,
      },
      req.body
    )
      .then(() => {
        res.redirect("/nations");
      })
      .catch(next);
  }

  paged(req, res, next) {}
}
module.exports = new NationController();

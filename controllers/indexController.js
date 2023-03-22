const Players = require("../models/player");
const User = require("../models/user");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

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

  regist(req, res, next) {
    res.render("register");
  }

  signup(req, res, next) {
    let password = req.body.password;
    User.register(new User(req.body), password, (err, user) => {
      if (err) {
        console.log(err);
        res.redirect("/register");
      } else {
        res.send(
          '<script>alert("Register success!"); window.location.href="/login";</script>'
        );
      }
    });
  }

  login(req, res, next) {
    // Check req.user present do logout
    if (req.user) {
      req.logout((err) => {
        if (err) {
          return next(err);
        } else {
          res.redirect("/");
        }
      });
    } else {
      res.render("login", {
        title: "Login Page",
      });
    }
  }

  signin(err, req, res, next) {
    if (err) {
      console.log(err);
      res.redirect("/login");
    }
  }

  formForgotPassword(req, res, next) {
    let button = "Send Email";
    let label = "Email Address";
    let icon = "fas fa-envelope";
    let paramName = "email";

    if (req.params.token) {
      button = "Reset Password";
      label = "New Password";
      icon = "fas fa-lock";
      paramName = "password";
    }

    res.render("forgotPassword", {
      title: "Forgot Password",
      button: button,
      label: label,
      icon: icon,
      paramName: paramName,
    });
  }

  forgotPassword(req, res, next) {
    const email = req.body.email;

    User.findOne({ username: email }, (err, user) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.send(
          '<script>alert("User not found"); window.location.href="/forgot-password";</script>'
        );
      }

      const token = crypto.randomBytes(20).toString("hex");

      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 3600000; //1 hour from now

      user.save((err) => {
        if (err) {
          return next(err);
        }

        //send password reset email using nodemailer
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "nhtn0311@gmail.com",
            pass: "iwlofxewpxiisgpn",
          },
        });

        const mailOptions = {
          to: user.username,
          from: "WC2023 <nhtn0311@gmail.com>",
          subject: "Password reset for WC2023",
          text: `You are receiving this email because you (or someone else) has requested a password reset for your account.\nPlease click on the following link, or paste it into your browser to reset your password:\n\n${req.headers.origin}/forgot-password/${token}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`,
        };

        console.log("Sending email");
        transporter.sendMail(mailOptions, (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log("Email sent");
          }
        });
        res.send(
          `<script>alert("An email has been sent to ${user.username} with further instructions"); window.location.href="/forgot-password";</script>`
        );
      });
    });
  }

  resetPassword(req, res, next) {
    let password = req.body.password;

    User.findOne(
      {
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() }, //the token should not have expired yet
      },
      (err, user) => {
        if (err) {
          return next(err);
        }
        if (!user) {
          return res.send(
            `<script>alert("Password reset token is invalid or has expired"); window.location.replace("${req.headers.referer}");</script>`
          );
        }

        //render the password reset form with the token included as a hidden field
        user.changePassword(user.password, password);
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        user.save((err) => {
          if (err) {
            return next(err);
          }

          //log in the user with their new password using passport
          req.login(user, (err) => {
            if (err) {
              return next(err);
            }
            res.send(
              `<script>alert("Password has been reset"); window.location.replace("${req.headers.origin}");</script>`
            );
          });
        });
      }
    );
  }
}

module.exports = new IndexController();

const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: req.flash('error'),
    isAuthenticated: false,
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: req.flash('error'),
    isAuthenticated: false,
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email }).then((user) => {
    if (!user) {
      req.flash('error', 'Invalid email or password');
      return res.redirect("/login");
    }
    bcrypt
      .compare(password, user.password)
      .then((doMatch) => {
        if (doMatch) {
          req.session.isLoggedIn = true;
          req.session.user = user;
          return req.session.save((err) => {
            console.log(err);
            const token = jwt.sign({ user_id: user._id, email }, "my secret", {
              expiresIn: "2d",
            });
            // console.log(token);
            user.token = token;
            return user.save().then((user) => {
              // res.header('Authorization', 'Bearer '+ token);
              return  res.redirect("/" );
            });
          });
        }
        req.flash('error', 'Invalid password');
        return res.redirect("/login");
      })
      .catch((err) => {
        console.log(err);
        res.redirect("/");
      });
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  // console.log(email);
  User.findOne({
    email: email,
  })
    .then((userDoc) => {
      if (userDoc){ 
        req.flash('error', 'Email exists already. please pic different one');
        return res.redirect("/signup");
      }
      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const user = new User({
            email: email,
            password: hashedPassword,
            cart: { items: [] },
          });

          return user.save();
        })
        .then((user) => {
          console.log(user);
          const token = jwt.sign({ user_id: user._id, email }, "my secret", {
            expiresIn: "2d",
          });
          // console.log(token);
          user.token = token;
          return user.save().then((user) => {
            return res.redirect("/login");
          });
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

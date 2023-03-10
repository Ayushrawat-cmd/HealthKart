const Student = require('../models/Student');



exports.getIndex = (req, res, next) => {
  Student.find()
    .then(students => {
      res.render('FrontPage/index', {
        studs: students,
        pageTitle: 'Student',
        path: '/',
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => {
      console.log(err);
    });
};

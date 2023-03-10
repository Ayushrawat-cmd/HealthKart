const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');

const isAuth = require('../middlewares/is-auth');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-student',isAuth, adminController.getAddStudent);

// /admin/products => GET

// /admin/add-product => POST
router.post('/add-student',isAuth, adminController.postAddStudent);

router.post('/fileUpload', isAuth, adminController.postAddfile);

router.get('/exportFile', isAuth, adminController.getDownloadFile);

module.exports = router;

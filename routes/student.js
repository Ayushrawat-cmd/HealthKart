const path = require('path');

const express = require('express');

const studentController = require('../controllers/student');

const router = express.Router();

router.get('/', studentController.getIndex);


module.exports = router;

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var passport = require('passport');
require('../config/passport')(passport);
var Device = require("../models/device");

/* GET ALL BOOKS */
router.get('/devicedata', function(req, res) {

   console.log('device api called');
    Device.find(function (err, devices) {
      if (err) return next(err);
      console.log(devices);
      res.json(devices);
   
})
})




module.exports = router;

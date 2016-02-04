var express = require('express');
var router = express.Router();
var models = require('../../models');
var Hotel = models.Hotel;
var Restaurant = models.Restaurant;
var Activity = models.Activity;
var Day = models.Day;
var Promise = require('bluebird');

router.post('/days/:id/:type', function (req, res, next) {
  //Add event on the give day (id) where type is the event type
  var id= req.params.id;
  var type = req.params.type;




});

router.post('/days/:id', function (req, res, next) {
  //Add event on the give day (id) where type is the event type
  var id= req.params.id;
  Day.create({
    number: id
  });



});

router.get('/days/:id/:type', function (requ, res, next) {
  //Get the information for the given day and event type
  var id= req.params.id;
  var type = req.params.type;


});

router.get('/days/:id', function (req, res, next) {
  //Get the information for the given day
  var id= req.params.id;
  res.json({id: id});


});

router.get('/days/all', function (req, res, next) {
  //Get all days
  res.send('YAY');
})



module.exports = router;
var express = require('express');
var router = express.Router();
var models = require('../../models');
var mongoose=require('mongoose');
var Hotel = models.Hotel;
var Restaurant = models.Restaurant;
var Activity = models.Activity;
var Day = models.Day;
var Promise = require('bluebird');

function plural(type) {
  return (type==="activity") ? "activities" : type+"s";
}

function typeAdd(type, name, id, res) {
  var modelName = type.slice(0,1).toUpperCase()+type.slice(1);

  mongoose.model(modelName).findOne({name: name})
  .then(function(result){
      Day.findOne({number: id})
      .then(function(day) { 
        if (type!="hotel") day[plural(type)].push(result._id);
        else day[type] = result._id;
        return day.save();
      }).then(function(day){
        res.send('done')
      })
  })
}

function typeDelete(type, name, id, res) {
  var modelName = type.slice(0,1).toUpperCase()+type.slice(1);

  mongoose.model(modelName).findOne({name: name})
  .then(function(result){
      Day.findOne({number: id})
      .then(function(day) { 
        if (type!="hotel") {
          day[plural(type)].pull(result)
        }
        else day[type] = null;
        return day.save();
      }).then(function(day){
        res.send('please!')
      })
  })
}


//------ADDS EVENTS TO DAYS
router.post('/days/:id/:type/:name', function (req, res, next) {
  //Add event on the give day (id) where type is the event type
  var id= Number(req.params.id);
  var type = req.params.type;
  var name = req.params.name;

  typeAdd(type, name, id, res );

});
//---DELETES EVENT FROM DAY
router.delete('/days/:id/:type/:name', function (req, res, next) {
  var id= Number(req.params.id);
  var type = req.params.type;
  var name = req.params.name;

  typeDelete(type,name, id, res);

})



router.post('/days/:id', function (req, res, next) {
  //Add event on the give day (id) where type is the event type
  var id= req.params.id;
  Day.create({
    number: id
  }).then(function(day) {
    res.send(day);
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
  Day.find({number:id})
  .then(function(obj) {
    res.send(obj);
  })

});

router.get('/days/all', function (req, res, next) {
  //Get all days
  res.send('YAY');
})

router.delete('/days/:id', function (req, res, next) {
  Day.remove({number: req.params.id})
  .then(function(something) {
    res.send({deleted: true})
  })
})






module.exports = router;
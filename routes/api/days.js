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


//------ADDS EVENTS TO DAYS
router.post('/days/:id/:type/:name', function (req, res, next) {
  //Add event on the give day (id) where type is the event type
  var id= Number(req.params.id);
  var type = req.params.type;
  var name = req.params.name;

  var modelName = type.slice(0,1).toUpperCase()+type.slice(1);
  var markersLL = null;
  mongoose.model(modelName).findOne({name: name})
  .then(function(result){
      Day.findOne({number: id})
      .then(function(day) { 
        if (type!="hotel" && day[plural(type)].indexOf(result._id)<0) {
          day[plural(type)].push(result._id);
          markersLL = result.place[0].location;
          console.log('accessed!');
        }
        else if(type === 'hotel' && !day[type]){
            day[type] = result._id; 
            markersLL = result.place[0].location;
            console.log('here too!');
        }
        return day.save();
      }).then(function(day){
        res.json(markersLL);
      })
  })
});

//---DELETES EVENT FROM DAY
router.delete('/days/:id/:type/:name', function (req, res, next) {
  var id= Number(req.params.id);
  var type = req.params.type;
  var name = req.params.name;

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
  Day.findOne({number:id}).populate('hotel').populate('restaurants').populate('activities')
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
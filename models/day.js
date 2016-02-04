var mongoose = require('mongoose');

var DaySchema = new mongoose.Schema({
  number: Number,
  hotel: {type: Schema.Types.ObjectId, ref: 'Hotel'},
  restaurants: [{type: Schema.Types.ObjectId, ref: 'Restaurant'}], 
  activities: [{type: Schema.Types.ObjectId, ref: 'Activity'}]
});

module.exports = mongoose.model('Day', DaySchema);
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var DaySchema = new Schema({
  number: Number,
  hotel: {type: Schema.Types.ObjectId, ref: 'Hotel'},
  restaurants: [{type: Schema.Types.ObjectId, ref: 'Restaurant'}], 
  activities: [{type: Schema.Types.ObjectId, ref: 'Activity'}]
});

module.exports = mongoose.model('Day', DaySchema);
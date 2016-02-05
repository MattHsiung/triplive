var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator')

var Schema = mongoose.Schema;

var DaySchema = new Schema({
  number: Number,
  hotel: {type: Schema.Types.ObjectId, ref: 'Hotel'},
  restaurants: [{type: Schema.Types.ObjectId, ref: 'Restaurant', unique: true}], 
  activities: [{type: Schema.Types.ObjectId, ref: 'Activity', unique: true}]
});

DaySchema.plugin(uniqueValidator);

module.exports = mongoose.model('Day', DaySchema);
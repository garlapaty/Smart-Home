var mongoose = require('mongoose');

var deviceSchema = new mongoose.Schema({
  deviceName: String,
  data: String
});

module.exports = mongoose.model('Device', deviceSchema);

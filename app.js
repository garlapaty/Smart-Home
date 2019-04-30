var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var mqtt = require('mqtt');
var Device = require('./models/device');

const io = require('socket.io')();

var mqttclient = mqtt.connect('mqtt://test.mosquitto.org');

mqttclient.on('connect', function() {
  console.log('mqtt connected');
  mqttclient.subscribe('mqtt-temp');
  mqttclient.subscribe('mqtt-humidity');
});

var socketio;

io.on('connection', socketio => {
  console.log('socket. io client connected');
  // client.emit('chat', "Hello frontend");
  socketio.on('sock-pub', message => {
    console.log('Data published from client is ---> ', message);
    var command = message.split('-');
    var dataToPublish = '{' + '"' + command[0] + '":' + command[1] + '}';
    mqttclient.publish('control', dataToPublish);
  });
  //client.emit('chat', new Date());

  mqttclient.on('message', function(topic, message) {
    // message is Buffer
    console.log(message.toString());
    var d = message.toString();
    if (topic == 'mqtt-temp') {
      console.log(message.toString());

      socketio.emit('tempChannel', message.toString());
      var newDevice = new Device({
        deviceName: 'temp',
        data: d
      });
      newDevice.save(function(err) {
        if (err) {
          console.log('data saved un- sucessfully');
        }
        console.log('data saved sucessfully');
      });
    } else {
      socketio.emit('humidityChannel', message.toString());
      var newDevice = new Device({
        deviceName: 'humidity',
        data: d
      });
      newDevice.save(function(err) {
        if (err) {
          console.log('data saved un- sucessfully');
        }
        console.log('data saved sucessfully');
      });
    }
  });
});

const port = 8000;
io.listen(port);
console.log('listening on port ', port);

var auth = require('./routes/auth');

var fetchdevice = require('./routes/fetchdevice');
var app = express();

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose
  //.connect('mongodb://localhost/mern-secure',
  .connect('mongodb://dbuser:dbpassword45@ds149146.mlab.com:49146/smart_home', {
    promiseLibrary: require('bluebird')
  })
  .then(() => console.log('connection succesful'))
  .catch(err => console.error(err));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: 'false' }));
app.use(express.static(path.join(__dirname, 'build')));

app.use('/api/auth', auth);
app.use('/api', fetchdevice);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

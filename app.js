var express = require('express')
  , os = require('os')
  , routes = require('./routes')
  , config = require('./config')
  , serialport = require('serialport');

var SerialPort = serialport.SerialPort; 

var app = module.exports = express.createServer();
function gt() {
	return (new Date()).getTime()-18000000;
}

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', {layout:false, pretty:true});
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

var  all_d=[]; 
var sp = new SerialPort("/dev/ttyUSB0", { 
	     baudrate: 57600,
	     parser: serialport.parsers.readline("\r\n") 
});

sp.on('data', function (data) {
	var words,hi,lo,temp;
	var data_arr;
	var ts=(new Date()).getTime();
	words = data.split(' ');
	if(words[0] == 'OK'){
    lo = parseInt(words[4]);
		hi = parseInt(words[5]);
		temp = hi*256.0+lo;
		if(temp > 32767.0){
     temp = temp - 65536.0;  
		}
    temp = (temp/10.0)*1.8+32.0 
    data_arr=[ts,temp];
		all_d.push(data_arr)
		io.sockets.emit('newdata', data_arr);
	}
});

sp.on("close", function (err) {
	  console.log("port closed");
});

sp.on("error", function (err) {
	  console.error("error", err);
});

sp.on("open", function () {
	  console.log("port opened");
});

// Routes

app.get('/', routes.index);
app.get('/flot', routes.flot);

var io=require('socket.io').listen(app);
app.listen(3000);
var limit=config.limit; 

io.sockets.on('connection', function(socket) {
	socket.emit('init', {limit:limit});
	if(all_d.length>0) {
		socket.emit('history', all_d);
	}
});


var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var ejs = require('ejs');

app.set('views', __dirname); //????????????

app.engine('.html', ejs.__express);
app.set('view engine', 'html');

app.use(express.static(__dirname + '/public'));

server.listen(1234);

//app.get('/', );

app.get('/tom', function (req, res) {
  res.sendFile(__dirname + '/tom.html');
});

//event listener 
io.on('connection', function (socket) {

	var obj = {
		'hello': 'world'
	};
  socket.emit('news', obj);

  socket.on('my other event', function (data) {
    console.log(data);
  });

  socket.on('wtf', function(data){
  	console.log(socket.id);
  	socket.broadcast.emit('wtf', data);
  });

});
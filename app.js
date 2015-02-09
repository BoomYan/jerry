var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var ejs = require('ejs');
var portNumber = server.listen(process.env.PORT || 1234);

app.set('views', __dirname); //????????????

app.engine('.html', ejs.__express);
app.set('view engine', 'html');

app.use(express.static(__dirname + '/public'));

server.listen(portNumber);

//app.get('/', );

app.get('/tom', function (req, res) {
  res.sendFile(__dirname + '/tom.html');
});
app.get('/jerry', function (req, res) {
  res.sendFile(__dirname + '/jerry.html');
});

//event listener 
io.on('connection', function (socket) {

  socket.on('tom', function (data) {
    // console.log(socket.id);
    socket.broadcast.emit('tom', data);
  });

  socket.on('jerry', function(data){
  	// console.log(socket.id);
  	socket.broadcast.emit('jerry', data);
  });

});
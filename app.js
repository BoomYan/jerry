var express    = require('express');
var app        = express();
var server     = require('http').Server(app);
var io         = require('socket.io')(server);
var ejs        = require('ejs');
var portNumber = process.env.PORT || 1234;
var tomReady   = false;
var jerryReady = false;
var selectedRole = '';

app.set('views', __dirname); //????????????

app.engine('.html', ejs.__express);
app.set('view engine', 'html');

app.use(express.static(__dirname + '/public'));

server.listen(portNumber);

// console.log(portNumber);

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/game.html');
});

app.get('/game', function (req, res) {
	res.sendFile(__dirname + '/game.html');
});

app.get('/tom', function (req, res) {
	res.sendFile(__dirname + '/tom.html');
});
app.get('/jerry', function (req, res) {
	res.sendFile(__dirname + '/jerry.html');
});

//event listener 
io.on('connection', function (socket) {

	socket.on('position',function(data){
		socket.broadcast.emit('position',data);
	});

	socket.on('reset',function(){
		io.sockets.emit('resetAll');
	})
	socket.on('tomCatchedJerry',function(){
		io.sockets.emit('tomCatchedJerry');
	});     
	socket.on('jerryGotTheFood',function(){
		io.sockets.emit('jerryGotTheFood');
	});
	socket.on('jerryMissedTheFood',function(){
		io.sockets.emit('jerryMissedTheFood');
	});
	socket.on('ready',function(data){
		if (data.role == 'tom'){
			tomReady    = true;
		}
		else{
			jerryReady  = true;
		}
		if(tomReady && jerryReady){
			tomReady    = false;
			jerryReady  = false;
			io.sockets.emit('startGame');

			selectedRole = '';
		}
	});
	socket.on('IWantToPlayAs',function(data){
		if(selectedRole == data.role)socket.emit('roleSelectedByOpponent',data);
		else{
			selectedRole = data.role;
			socket.emit('roleSelectedDone',data);
		}
	});  

});

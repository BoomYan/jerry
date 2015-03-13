var express    = require('express');
var app        = express();
var server     = require('http').Server(app);
var io         = require('socket.io')(server);
var ejs        = require('ejs');
var portNumber = process.env.PORT || 1234;
var tomReady   = false;
var jerryReady = false;

app.set('views', __dirname); //????????????

app.engine('.html', ejs.__express);
app.set('view engine', 'html');

app.use(express.static(__dirname + '/public'));

server.listen(portNumber);

// console.log(portNumber);

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/home.html');
});

app.get('/game', function (req, res) {
  var roomNum = '/';
  for (var i = 0; i < 4; i++) {
    var num = Math.round(Math.random() * 9);
    roomNum += num;
  }
  res.redirect(roomNum);
	// res.sendFile(__dirname + '/game.html');
});

app.get('/:roomNum', function (req, res) {
  res.render('game.html');
});

var lookUpTable = [];

// the format of lookUpTable will be:
// var lookUpTable = {
//   'roomNum': ['socketID1', 'socketID2'],
// };

//event listener 
io.on('connection', function (socket) {

	var t =0;
	var roomNumOfSocket = null;

	function isRoleSelected(roomNum,role){
	 	if (lookUpTable[roomNum] === undefined) {
	 		lookUpTable[roomNum] = [];
	 	}
		var col = (role == 'tom')?0:1;
		return (lookUpTable[roomNum][col] == null)?false:true;
	}

	function getIntoRoom(roomNum,role,id){
		var col = (role == 'tom')?0:1;
		lookUpTable[roomNum][col] = id;
		roomNumOfSocket = roomNum;
	}

	function selectRole(roomNum,role,id){
		
	}

	function sendDataToYourOpponent(msg,data){
		var id0 = lookUpTable[roomNumOfSocket][0];
		var id1 = lookUpTable[roomNumOfSocket][1];
		opponentId= (socket.id !== id0)?id0:id1;
    	for (var j = 0; j < io.sockets.sockets.length; j++) {
      		if (io.sockets.sockets[j].id === opponentId) {
        		io.sockets.sockets[j].emit(msg, data);
      		}
		}
	}

	function sendDataToYourRoom(msg,data){
		var id0 = lookUpTable[roomNumOfSocket][0];
		var id1 = lookUpTable[roomNumOfSocket][1];
    	for (var j = 0; j < io.sockets.sockets.length; j++) {
      		if (io.sockets.sockets[j].id === id0 || io.sockets.sockets[j].id === id1) {
        		io.sockets.sockets[j].emit(msg, data);
     		}
    	}
	}

	socket.on('position',function(data){
		sendDataToYourOpponent('position',data);
		// socket.broadcast.emit('position',data);
		// t++;
		// console.log(socket.id,t,typeof socket.id);
	});

	socket.on('reset',function(){
		sendDataToYourRoom('resetAll',null);
		// io.sockets.emit('resetAll');
	})
	// socket.on('tomCatchedJerry',function(){
	// 	io.sockets.emit('tomCatchedJerry');
	// });     
	// socket.on('jerryGotTheFood',function(){
	// 	io.sockets.emit('jerryGotTheFood');
	// });
	// socket.on('jerryMissedTheFood',function(){
	// 	io.sockets.emit('jerryMissedTheFood');
	// });

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
			sendDataToYourRoom('startGame',null);
			// io.sockets.emit('startGame');

			// selectedRole = '';
		}
	});
	socket.on('IWantToPlayAs',function(data){
		if(isRoleSelected(data.roomNum,data.role))socket.emit('roleSelectedByOpponent',data);
		else{
			getIntoRoom(data.roomNum,data.role,socket.id);
			socket.emit('roleSelected',data);
		}
	}); 
	socket.on('jerryBlood',function(data){
		sendDataToYourRoom('jerryBlood',data);
		// io.sockets.emit('jerryBlood',data);
	})

});

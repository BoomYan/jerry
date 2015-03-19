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
//roomNum, tom's socket ID, jerry's socket ID
var roomStatus = [];
//roomNum, players in rooms, ready players in room



//event listener 
io.on('connection', function (socket) {
	var roomNumOfSocket = null;
	var roleNumOfSocket = null;// 0 if tom, 1 if jerry
	var iAmReadyOfSocket = false;
	var isGameStarted = false;

	//1.0
	function isRoomFull(roomNum){
	 	if (roomStatus[roomNum] === undefined) {
	 		//init room in roomStatus[][]
	 		roomStatus[roomNum] = [];
	 		roomStatus[roomNum][0] = 0;
	 		roomStatus[roomNum][1] = 0;
	 	}
	 	// console.log(roomStatus[roomNum][0]);
	 	return roomStatus[roomNum][0] === 2;
	}
	function getIntoRoom(roomNum){
		// if(isRoomFull(roomNum)){
		// 	socket.emit('roomFull');
		// 	return;
		// }
		roomNumOfSocket = roomNum;
		roomStatus[roomNum][0]++;
	}

	function isRoleSelected(role){
	 	if (lookUpTable[roomNumOfSocket] === undefined) {
	 		lookUpTable[roomNumOfSocket] = [];
	 	}
		var col = (role === 'tom')?0:1;
		return (lookUpTable[roomNumOfSocket][col] == null)?false:true;
	}

	function getIntoLookUpTable(role,id){
		roleNumOfSocket = (role === 'tom')?0:1;
		lookUpTable[roomNumOfSocket][roleNumOfSocket] = id;
	}

	function resetLookUpTable(){
		lookUpTable[roomNumOfSocket][roleNumOfSocket] = null;
	}

	function sendDataToYourOpponent(msg,data){
		var id0 = lookUpTable[roomNumOfSocket][0];
		var id1 = lookUpTable[roomNumOfSocket][1];
		opponentId= (socket.id !== id0)?id0:id1;
		if(id0 != null && id1 != null){
    		for (var j = 0; j < io.sockets.sockets.length; j++) {
     	 		if (io.sockets.sockets[j].id === opponentId) {
    	    		io.sockets.sockets[j].emit(msg, data);
    	  		}
			}
		}
	}

	function sendDataToYourRoom(msg,data){
		var id0 = lookUpTable[roomNumOfSocket][0];
		var id1 = lookUpTable[roomNumOfSocket][1];
		if(id0 != null && id1 != null){
  		  	for (var j = 0; j < io.sockets.sockets.length; j++) {
      			if (io.sockets.sockets[j].id === id0 || io.sockets.sockets[j].id === id1) {
        			io.sockets.sockets[j].emit(msg, data);
     			}
    		}
    	}
	}
	socket.on('tryGetIntoRoom',function(data){
		if(isRoomFull(data.roomNum))
			socket.emit('roomFull');
		else{
			getIntoRoom(data.roomNum);
			socket.emit('getIntoRoomDone');
		}

	});
	socket.on('IWantToPlayAs',function(data){
		if(isRoleSelected(data.role))socket.emit('roleSelectedByOpponent',data);
		else{
			getIntoLookUpTable(data.role,socket.id);
			socket.emit('roleSelected',data);
		}
	}); 
	socket.on('iAmReady',function(data){
		//avoid multiple click
		if(iAmReadyOfSocket) return;
		roomStatus[roomNumOfSocket][1]++; 
		console.log(roomStatus[roomNumOfSocket][1]);
		iAmReadyOfSocket = true;

		//isBothReady?
		if(roomStatus[roomNumOfSocket][1] >= 2){
			//unreadyBoth
			iAmReadyOfSocket = false;
			roomStatus[roomNumOfSocket][1] = 0;
			//startGame		
			sendDataToYourRoom('startGame',null);
			isGameStarted = true;
		}
	});
	socket.on('position',function(data){
		sendDataToYourOpponent('position',data);
		// socket.broadcast.emit('position',data);
		// t++;
		// console.log(socket.id,t,typeof socket.id);
	});

 	socket.on('disconnect', function () {
 		if (roomNumOfSocket != null){
 			//this player already get into room
 			roomStatus[roomNumOfSocket][0]--;
 	  		if(roomStatus[roomNumOfSocket][0]<0)roomStatus[roomNumOfSocket][0]=0;
 			//roomStatus[roomNumOfSocket][0] = (roomStatus[roomNumOfSocket][0]>=1)?roomStatus[roomNumOfSocket][0]-1:0;
  			if(roleNumOfSocket != null){
  			//this player already select a role
    			lookUpTable[roomNumOfSocket][roleNumOfSocket] = null;
    			if(isGameStarted === false && iAmReadyOfSocket === true){
    				//this player already ready and wait for another player
					roomStatus[roomNumOfSocket][1]--;
					if(roomStatus[roomNumOfSocket][1]<0)roomStatus[roomNumOfSocket][1]=0;
				}

  			}

  		}
  		if(isGameStarted == true){
				//this player was in the game
			console.log('opponentLeftRoom');
			sendDataToYourOpponent('opponentLeftRoom',null);
		}
  		
  	});
	socket.on('gameStop',function(){
		resetLookUpTable();
		roleNumOfSocket = null;
		iAmReadyOfSocket = false;
		isGameStarted = false;
	});

	socket.on('reset',function(){
		sendDataToYourRoom('resetAll',null);
		// io.sockets.emit('resetAll');
	});
	// socket.on('tomCatchedJerry',function(){
	// 	io.sockets.emit('tomCatchedJerry');
	// });     
	// socket.on('jerryGotTheFood',function(){
	// 	io.sockets.emit('jerryGotTheFood');
	// });
	// socket.on('jerryMissedTheFood',function(){
	// 	io.sockets.emit('jerryMissedTheFood');
	// });



	socket.on('jerryBlood',function(data){
		sendDataToYourRoom('jerryBlood',data);
		// io.sockets.emit('jerryBlood',data);
	})

});

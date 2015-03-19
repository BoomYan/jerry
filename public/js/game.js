(function (exports) {
	var reset                                                  = function(){
		//socket.emit('reset');
		console.log('reset');
		//location.reload(true);
		//jerry.position.x                                        = (Math.random()-0.5)*groundWidth;
		jerry.position.x                                          = 0;
		jerry.position.z                                          = -5;
		tom.position.x                                            = 0;
		tom.position.z                                            = disBetTandJ;
		jerryBlood                                                = 100;
	}

	var resetCamera                                            = function(){
		camera                                                    = new THREE.PerspectiveCamera( 90, window.innerWidth/window.innerHeight, 0.1, 1000 );
		if (role == "jerry"){
			camera.rotation.y                                        = 180 * Math.PI / 180;
		}
	}

	var tryGetIntoRoom = function(){
		roomNum					   = document.location.pathname.slice(1);
		gameStop                                                  = true;
		socket.emit('tryGetIntoRoom',{'roomNum':roomNum});
		document.getElementById("selectRole").style.display       = 'none';
		document.getElementById('waitForReady').style.display     = "none";
		document.getElementById("result").style.display           = "none";
		document.getElementById("distanceRemained").style.display = "none";
		document.getElementById("bloodRemained").style.display    = "none";

	}

	var directToNewRoom = function(){
		alert('Room is Full, will bring you to another room :)');
		location.href = 'http://' + location.host + '/game';
	}

 	var trySelectRole = function(role){
 		socket.emit('IWantToPlayAs',{'role':role});
 	}

 	var anotherRound = function(){
 		reset();
 		waitForSelect();
 	}
	var startGame                                              = function(){
		resetCamera();
		gameStop                                                  = false;
		// selectedRoleByOpponent                                    = '';
		document.getElementById("selectRole").style.display       = 'none';
		document.getElementById('waitForReady').style.display     = "none";
		document.getElementById("result").style.display           = "none";
		document.getElementById("distanceRemained").style.display = "block";
		document.getElementById("bloodRemained").style.display    = "block";

	}

	var stopGame                                               = function(){
		gameStop                                                  = true;
 		socket.emit('gameStop');
		document.getElementById("selectRole").style.display       = 'none';
		document.getElementById('waitForReady').style.display     = "none";
		document.getElementById("result").style.display           = "block";
		document.getElementById("distanceRemained").style.display = "block";
		document.getElementById("bloodRemained").style.display    = "block";
	}


	var waitForSelect                                          = function(){
		gameStop                                                  = true;

		document.getElementById("roleMSG").innerHTML              = "Who do you want to play as!";
		document.getElementById("selectRole").style.display       = 'block';
		document.getElementById('waitForReady').style.display     = "none";
		document.getElementById("result").style.display           = "none";
		document.getElementById("distanceRemained").style.display = "none";
		document.getElementById("bloodRemained").style.display    = "none";

	}

	var waitForReady                                           = function(){
		console.log('waitForReady is invoked');
		gameStop                                                  = true;

		document.getElementById("readyMSG").innerHTML             = "Are you Ready?";
		document.getElementById("selectRole").style.display       = 'none';
		document.getElementById('waitForReady').style.display     = "block";
		document.getElementById("result").style.display           = "none";
		document.getElementById("distanceRemained").style.display = "none";
		document.getElementById("bloodRemained").style.display    = "none";

		//document.getElementById('iAmReady').style.display			= "none";
	}

	document.getElementById('anotherRound').onclick            = function(){
		// waitForSelect();
		anotherRound();
		document.getElementById("distanceRemained").style.display = "none";
		document.getElementById("bloodRemained").style.display    = "none";

	}
	document.getElementById('iAmReady').onclick                = function(){
		socket.emit('iAmReady',{'role':role});
		document.getElementById('readyMSG').innerHTML             = '<p>Waiting for your opponent··· <br></br> To invite your friend, just give him this URL:<U>'+window.location.protocol + "//" + window.location.host + "/" + window.location.pathname+'</u></p>';
		//document.getElementById('iAmReady').style.display			= "block";
	}

	document.getElementById('playAsTom').onclick               = function(){
		trySelectRole('tom');
	}

	document.getElementById('playAsJerry').onclick             = function(){
		trySelectRole('jerry');
	}

	socket.on('roomFull',function(){
		directToNewRoom();
	});

	socket.on('getIntoRoomDone',function(){
		waitForSelect();
	});

	socket.on('roleSelectedByOpponent',function(data){
		document.getElementById('roleMSG').innerHTML              = 'Sorry, '+data.role+' has been selected by your opponent T.T';
	});

	socket.on('roleSelected', function(data){
		role                                                      = data.role;
		waitForReady();
	});

	socket.on('opponentLeftRoom', function(){
		alert('Your opponent has left the room, game stop..');
		stopGame();
	});

	socket.on('resetAll', function(){
		reset();
	});

	socket.on('startGame',function(){
		reset();
		startGame();
	});


	function animate() {

		requestAnimationFrame( animate );

		render();

	}


	exports.reset                                              = reset;
	exports.startGame                                          = startGame;
	exports.stopGame                                           = stopGame;
	exports.waitForSelect                                      = waitForSelect;
	exports.waitForReady                                       = waitForReady;
	exports.animate                                            = animate;
	exports.tryGetIntoRoom									   = tryGetIntoRoom;
})(this);

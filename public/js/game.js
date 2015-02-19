
(function (exports) {
	var reset                                              = function(){
		//socket.emit('reset');
		console.log('reset');
		//location.reload(true);
		//jerry.position.x                                    = (Math.random()-0.5)*groundWidth;
		jerry.position.x                                      = 0;
		jerry.position.z                                      = -5;
		tom.position.x                                        = 0;
		tom.position.z                                        = disBetTandJ;
	}

	var resetCamera = function(){
		camera                 = new THREE.PerspectiveCamera( 90, window.innerWidth/window.innerHeight, 0.1, 1000 );
		if (role == "jerry"){
			camera.rotation.y         = 180 * Math.PI / 180;
		}
	}



	var startGame                                          = function(){
		resetCamera();
		gameStop                                              = false;

		selectedRoleByOpponent = '';
		document.getElementById("selectRole").style.display = 'none';
		document.getElementById('waitForReady').style.display = "none";
		document.getElementById("result").style.display       = "none";

	}

	var stopGame                                           = function(){
		gameStop                                              = true;

		document.getElementById("selectRole").style.display = 'none';
		document.getElementById('waitForReady').style.display = "none";
		document.getElementById("result").style.display       = "block";
	}


	var waitForSelect = function(){
		gameStop                                              = true;

		document.getElementById("roleMSG").innerHTML ="Who do you want to play as!";
		document.getElementById("selectRole").style.display = 'block';
		document.getElementById('waitForReady').style.display = "none";
		document.getElementById("result").style.display       = "none";

	}

	var waitForReady                                       = function(){
		console.log('waitForReady is invoked');
		gameStop                                              = true;

		document.getElementById("readyMSG").innerHTML         = "Are you Ready?";
		document.getElementById("selectRole").style.display = 'none';
		document.getElementById('waitForReady').style.display = "block";
		document.getElementById("result").style.display       = "none";
	}

	document.getElementById('anotherRound').onclick        = function(){
		waitForSelect();
	}
	document.getElementById('iAmReady').onclick            = function(){
		socket.emit('ready',{'role':role});
		document.getElementById('readyMSG').innerHTML         = 'Waiting for your opponent···';
	}

	document.getElementById('playAsTom').onclick =function(){
		if(selectedRoleByOpponent=='tom'){
			document.getElementById('roleMSG').innerHTML = 'Sorry,Tom has been selected by your opponent T.T';
			return;
		}
		else{
		//selectRole Sucessfully
		role='tom';
		socket.emit('IWantToPlayAs',{'role':'tom'});

		waitForReady();
		}

	}

	document.getElementById('playAsJerry').onclick =function(){
		if(selectedRoleByOpponent=='jerry'){
			document.getElementById('roleMSG').innerHTML = 'Sorry,Jerry has been selected by your opponent T.T';
			return;
		}
		else{
		//selectRole Sucessfully
		role='jerry';
		socket.emit('IWantToPlayAs',{'role':'jerry'});


		waitForReady();
		}
	}


	socket.on('resetAll', function(){
		reset();
	});

	socket.on('startGame',function(){
		reset();
		startGame();
	});

	socket.on('selectedRoleByOpponent',function(data){
		selectedRoleByOpponent = data.role;
	});

	function animate() {

		requestAnimationFrame( animate );

		render();

	}


	exports.reset                                          = reset;
	exports.startGame                                      = startGame;
	exports.stopGame                                       = stopGame;
	exports.waitForSelect = waitForSelect;
	exports.waitForReady                                   = waitForReady;
	exports.animate                                        = animate;
})(this);

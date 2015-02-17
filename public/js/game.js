
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

	var startGame                                          = function(){
		gameStop                                              = false;
		document.getElementById('waitForReady').style.display = "none";
		document.getElementById("result").style.display       = "none";

	}

	var stopGame                                           = function(){
		gameStop                                              = true;
		document.getElementById('waitForReady').style.display = "none";
		document.getElementById("result").style.display       = "block";
	}

	var waitForReady                                       = function(){
		console.log('waitForReady is invoked');


		gameStop                                              = true;

		document.getElementById("readyMSG").innerHTML         = "Are you Ready?";
		document.getElementById('waitForReady').style.display = "block";
		document.getElementById("result").style.display       = "none";
	}


	document.getElementById('anotherRound').onclick        = function(){
		waitForReady();
	}
	document.getElementById('iAmReady').onclick            = function(){
		socket.emit('ready',{'role':role});
		document.getElementById('readyMSG').innerHTML         = 'Waiting for your opponent···';

	}

	socket.on('resetAll', function(){
		reset();
	});

	socket.on('startGame',function(data){
		reset();
		startGame();
	});

	function animate() {

		requestAnimationFrame( animate );

		render();

	}




	exports.reset                                          = reset;
	exports.startGame                                      = startGame;
	exports.stopGame                                       = stopGame;
	exports.waitForReady                                   = waitForReady;
	exports.animate                                        = animate;
})(this);

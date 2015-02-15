(function (exports){
	var nextTom                                            = function(){
		tom.position.z                                        = jerry.position.z+disBetTandJ;
		emitTom();
	}


	var setCamera                                          = function(x,y,z){
		camera.position.x                                     = x;
		camera.position.y                                     = y;
		camera.position.z                                     = z;
	}


	var isHit                                              = function(a,b){
		var disBet;
		if(b == food)disBet=cubeSize*5;
		else disBet                                           = cubeSize;
		if(Math.abs(b.position.z-a.position.z)<=disBet){
			if(Math.abs(b.position.x-a.position.x)<=disBet*hitScale)
			{
				return true;
			}

		}
		return false;
	}


	var updateDistanceRemained                             = function(){
		var distanceRemained                                  = Math.round(food.position.z-jerry.position.z);
		document.getElementById('distanceRemained').innerHTML = 'Distance Remained For Jerry: '+distanceRemained;
	}

	var updateJerrySpeed                                   = function(){
		jerrySpeed                                            = normalSpeed * (1+5*(targetDistance - distanceRemained)/targetDistance);
		// console.log(jerrySpeed);				
	}


	var reset                                              = function(){
		//socket.emit('reset');
		console.log('reset');
		//location.reload(true);
		//jerry.position.x                                    = (Math.random()-0.5)*groundWidth;
		jerry.position.x                                      = 0;
		jerry.position.z                                      = -5;
		tom.position.x                                        = 0;
		tom.position.z                                        = disBetTandJ;
		document.getElementById("result").style.display       = "none";
	}



	var stopGame                                           = function(){
		jerrySpeed                                            = 0;
		document.getElementById("result").style.display       = "block";
	}

	var tomCatchedJerry                                    = function(){
		stopGame();
		if (role == 'tom')
			document.getElementById('resultResult').innerHTML    = 'Yay, you win!! You catched the rat!!';
		else
			document.getElementById('resultResult').innerHTML    = 'You lose!! You have been catched!!';

	}    
	var jerryGotTheFood                                    = function(){
		stopGame();
		if (role == 'tom')
			document.getElementById('resultResult').innerHTML    = 'You lose!! Jerry got the food!!';
		else
			document.getElementById('resultResult').innerHTML    = 'Yay, you win!! You got the food!!';

	}
	var jerryMissedTheFood                                 = function(){
		stopGame();    
		if (role == 'tom')
			document.getElementById('resultResult').innerHTML    = 'Yay, you win!! Jerry missed the food!!';
		else
			document.getElementById('resultResult').innerHTML    = 'You lose!! You missed the food!!';
	}



	var result                                             = function(){

		if(isHit(jerry,tom)){
			tomCatchedJerry();
			return;
		}

		if((food.position.z-jerry.position.z)<cubeSize*3) {
			if(isHit(jerry,food)){
				jerryGotTheFood();
				return;
			}
			else{
				jerryMissedTheFood();
				return;	
			}
		};
	}


	exports.nextTom                                        = nextTom;
	exports.setCamera                                      = setCamera;
	// exports.isCatched                                   = isCatched;
	exports.updateDistanceRemained                         = updateDistanceRemained;
	exports.isHit                                          = isHit;
	exports.updateJerrySpeed                               = updateJerrySpeed;
	exports.reset                                          = reset;
	exports.stopGame                                       = stopGame;
	exports.result                                         = result;




})(this);

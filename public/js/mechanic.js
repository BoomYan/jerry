(function (exports){

	var alreadyToggled                                     = false;

	var nextTom                                            = function(){
		if(((jerry.position.z-tom.position.z)>=cubeSize)&& (!isHit(jerry,tom)) && (!isHit(jerry,food))){
			tom.position.z                                       = tom.position.z+disBetTandJ;
		}
	}

	var toggleFPV                                          = function(){
		if(keyboard.pressed("space") && !alreadyToggled){
			fpv                                                  = !fpv;
			alreadyToggled                                       = true;
			// console.log("toggleFPV is invoked");
		}
		if(!keyboard.pressed("space")) alreadyToggled         = false;
	}

	var setCamera                                          = function(x,y,z){

		// setInterval(toggleFPV,1000);
		toggleFPV();
		camera.position.x                                     = x;
		if(!fpv){
			if(role=="tom")	z=z+2;
			else z                                               = z-2;

			y                                                    = y+2;
		}
		camera.position.y                                     = y;
		camera.position.z                                     = z;
	
	}


	var isHit                                              = function(a,b){
		var disBet;
		if(b == food)disBet=cubeSize*3;
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
		var distanceRemained                                  = Math.round(food.position.z-jerry.position.z-3*cubeSize);
		document.getElementById('distanceRemained').innerHTML = 'Distance Remained For Jerry: '+distanceRemained;
	}

	var updateJerrySpeed                                   = function(){
		jerrySpeed                                            = normalSpeed * (1+5*(targetDistance - distanceRemained)/targetDistance);
		// console.log(jerrySpeed);				
	}


	var updateCharacter                                    = function(character){
		var metaShift;
		if (role == "tom") {
			metaShift                                            = tomMetaShift;
		}	
		else{
			metaShift                                            = -jerryMetaShift;
			character.position.z+=jerrySpeed;
		}
		
		faceDetection();

		if(aPos){
			shift                                                = -metaShift*(aPos[0]-120)/1200; //aPos0~240
		}
		else{
			if(keyboard.pressed("left")) character.position.x -= metaShift/30;
			if(keyboard.pressed("right")) character.position.x += metaShift/30;
		}
		character.position.x +=shift;
		character.position.x                                  = Math.max(character.position.x,-groundWidth/2);
		character.position.x                                  = Math.min(character.position.x,groundWidth/2);
		// console.log('updateMe invoked');
	}

	//Following codes are for single player
	var updateTom                                          = function(){
		// var step                                           = 0.3
		// if(tom.position.x>jerry.position.x)
		// tom.position.x -=step;
		// else tom.position.x+=step;
	}


	var updateJerry                                        = function(){
		// jerry.position.z +=jerrySpeed;
	}


	exports.nextTom                                        = nextTom;
	exports.setCamera                                      = setCamera;
	// exports.isCatched                                   = isCatched;
	exports.updateDistanceRemained                         = updateDistanceRemained;
	exports.isHit                                          = isHit;
	exports.updateJerrySpeed                               = updateJerrySpeed;
	exports.updateCharacter                                = updateCharacter;



})(this);

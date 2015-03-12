(function (exports){

	var alreadyToggledFPV                                     = false;
	var disBetTandJOnX = 0; // for feedback system

	var nextTom                                            = function(){
		if(((jerry.position.z-tom.position.z)>=0)&& (!isHit(jerry,tom)) && (!isHit(jerry,food))){
			tom.position.z                                       = tom.position.z+disBetTandJ;
			if(Math.abs(jerry.position.x-tom.position.x) > disBetTandJOnX){
				tomMetaShift += 0.7;
				disBetTandJOnX = Math.abs(jerry.position.x-tom.position.x);
				console.log("tomMetaShift: "+tomMetaShift);
			}
			else{
				tomMetaShift -=0.4;
				isBetTandJOnX = Math.abs(jerry.position.x-tom.position.x);
				console.log("tomMetaShift: "+tomMetaShift);
			}

			console.log("nextTom invoked");
		}
	}

	var toggleFPV                                          = function(){
		if(keyboard.pressed("space") && !alreadyToggledFPV){
			fpv                                                  = !fpv;
			alreadyToggledFPV                                       = true;
			// console.log("toggleFPV is invoked");
		}
		if(!keyboard.pressed("space")) alreadyToggledFPV         = false;
	}

	var setCamera                                          = function(x,y,z){

		// setInterval(toggleFPV,1000);
		toggleFPV();
		camera.position.x                                     = x;
		if(!fpv){
			if(role=="tom")	z=z+cubeSize*2;
			else z                                               = z-cubeSize*2;

			y                                                    = y+cubeSize;
		}
		camera.position.y                                     = y;
		camera.position.z                                     = z;
		
	}

	var setPointLight                                          = function(x,y,z){

		// // setInterval(toggleFPV,1000);
		// toggleFPV();
		pointLight.position.x                                     = x;
		pointLight.position.y                                     = y;
		pointLight.position.z                                     = z;
		
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
		var distanceRemained                                  = Math.round((food.position.z-jerry.position.z-3*cubeSize)*10)/10;
		document.getElementById('distanceRemained').innerHTML = 'Distance Remained For Jerry: '+distanceRemained;
	}

	var updateJerrySpeed                                   = function(){
		jerrySpeed                                            = normalSpeed * (1+5*(targetDistance - distanceRemained)/targetDistance);
		// console.log(jerrySpeed);				
	}
	var updateJerryBlood                                    = function(){
		var distanceForBlood = Math.sqrt(Math.pow((jerry.position.x - tom.position.x),2)+Math.pow((jerry.position.z - tom.position.z),2));
		

		if(distanceForBlood<tomHeatRange)
		{
			jerryBlood += (tomHeatRange - distanceForBlood)*metaBloodDecrease/tomHeatRange;


		}
		else{
			jerryBlood = jerryBlood - metaBloodDecrease*0.2;
		}

		jerryBlood = Math.round(jerryBlood*10)/10;
		socket.emit('jerryBlood', {'jerryBlood': jerryBlood});  
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
	exports.setPointLight								   = setPointLight;
	exports.updateJerryBlood							   = updateJerryBlood;


})(this);

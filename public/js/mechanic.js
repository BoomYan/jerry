(function (exports){
	var nextTom                                            = function(){
		tom.position.z                                        = tom.position.z+disBetTandJ;
	}

	var toggleFPV                                          = function(){
		if(keyboard.pressed("space")){
			fpv                                                  = !fpv;
			console.log("toggleFPV is invoked");
		}
	}

	var setCamera                                          = function(x,y,z){

		setInterval(toggleFPV,1000);
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
		var distanceRemained                                  = Math.round(food.position.z-jerry.position.z-3*cubeSize);
		document.getElementById('distanceRemained').innerHTML = 'Distance Remained For Jerry: '+distanceRemained;
	}

	var updateJerrySpeed                                   = function(){
		jerrySpeed                                            = normalSpeed * (1+5*(targetDistance - distanceRemained)/targetDistance);
		// console.log(jerrySpeed);				
	}





	exports.nextTom                                        = nextTom;
	exports.setCamera                                      = setCamera;
	// exports.isCatched                                   = isCatched;
	exports.updateDistanceRemained                         = updateDistanceRemained;
	exports.isHit                                          = isHit;
	exports.updateJerrySpeed                               = updateJerrySpeed;





})(this);

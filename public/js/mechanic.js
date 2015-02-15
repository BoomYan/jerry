(function (exports){
	var nextTom                                            = function(){
		tom.position.z                                        = tom.position.z+disBetTandJ;
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

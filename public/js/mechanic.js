(function (exports){
			var nextTom = function(){
				tom.position.z=jerry.position.z+disBetTandJ;
				cube0.position.z+=tom.position.z-100;
				emitTom();
			}


			var setCamera = function(x,y,z){
				camera.position.x=x;
				camera.position.y=y;
				camera.position.z=z;
			}


			var isHit = function(a,b){
				var disBet;
				if(b == food)disBet=cubeSize*3;
					else disBet=cubeSize;
				console.log(disBet);
				if(Math.abs(b.position.z-a.position.z)<=disBet){
					if(Math.abs(b.position.x-a.position.x)<=disBet*1.5)
					{
						return true;
					}

				}
				return false;
			}


			var isCatched = function(){
				if(Math.abs(tom.position.x-jerry.position.x)<=cubeSize*1.5){
					console.log("Catched!!!");
					document.getElementById('Catch').innerHTML = 'Catched!!!'
				}
				
				else{
					console.log("No Catch!!!");
				
				document.getElementById('Catch').innerHTML = 'No Catch!'
				}
			}


			var updateDistanceRemained=function(){
				var distanceRemained = Math.round(food.position.z-jerry.position.z);
				document.getElementById('distanceRemained').innerHTML='Distance Remained: '+distanceRemained;
			}

			var updateJerrySpeed=function(){
				jerrySpeed= normalSpeed * (1+5*(targetDistance - distanceRemained)/targetDistance);
				// console.log(jerrySpeed);				
			}


			var reset = function(){
				//socket.emit('reset');
				jerry.position.x = (Math.random()-0.5)*groundWidth;
				jerry.position.z =-5;
				tom.position.x = 0;
				tom.position.z=disBetTandJ;
			}

			socket.on('resetAll', function(){
				console.log('received reset socket');

				jerry.position.x = (Math.random()-0.5)*groundWidth;
				jerry.position.z =-5;
				tom.position.x = 0;
				tom.position.z=disBetTandJ;
			});

			exports.nextTom=nextTom;
			exports.setCamera=setCamera;
			exports.isCatched=isCatched;
			exports.updateDistanceRemained=updateDistanceRemained;
			exports.isHit=isHit;
			exports.updateJerrySpeed=updateJerrySpeed;
			exports.reset=reset;

})(this);
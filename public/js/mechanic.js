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

			var distanceRemained=function(){
				var a = Math.round(food.position.z-jerry.position.z);
				document.getElementById('distanceRemained').innerHTML=a;

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
			exports.distanceRemained=distanceRemained;



})(this);
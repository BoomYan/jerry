(function (exports){
	var tomCatchedJerry                              = function(){
		stopGame();
		if (role == 'tom')
			document.getElementById('resultMSG').innerHTML = 'Yay, you win!! You catched the rat!!';
		else
			document.getElementById('resultMSG').innerHTML = 'You lose!! You have been catched!!';

	}    
	var jerryGotTheFood                              = function(){
		stopGame();
		if (role == 'tom')
			document.getElementById('resultMSG').innerHTML = 'You lose!! Jerry got the food!!';
		else
			document.getElementById('resultMSG').innerHTML = 'Yay, you win!! You got the food!!';

	}
	var jerryMissedTheFood                           = function(){
		stopGame();    
		if (role == 'tom')
			document.getElementById('resultMSG').innerHTML = 'Yay, you win!! Jerry missed the food!!';
		else
			document.getElementById('resultMSG').innerHTML = 'You lose!! You missed the food!!';
	}



	var result                                       = function(){

		if(isHit(jerry,tom)){
			tomCatchedJerry();
			return;
		}

		if((food.position.z-jerry.position.z)<cubeSize*3&&isHit(jerry,food)){
			jerryGotTheFood();
			return;
		}
		if((jerry.position.z-food.position.z)>=2*cubeSize) jerryMissedTheFood();
	}
	exports.result                                   = result;
})(this);

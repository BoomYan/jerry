(function (exports) {


	var emitPosition     = function(object){
		socket.emit('position', {'x': object.position.x, 'y': object.position.y, 'z': object.position.z});  
	}

	socket.on('position', function(data){
		if(role == 'tom') {
			//console.log('received jerry socket');
			jerry.position.x   = data.x;
			jerry.position.y   = data.y;
			jerry.position.z   = data.z;
		}
		else {
			tom.position.x     = data.x;
			tom.position.y     = data.y;
			tom.position.z     = data.z;
		}

	});

	socket.on('jerryBlood',function(data){
		document.getElementById('bloodRemained').innerHTML = 'Body Temperature of Jerry: '+data.jerryBlood;
		jerryBlood = data.jerryBlood;
	});

	exports.emitPosition = emitPosition;

})(this);

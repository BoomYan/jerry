(function (exports) {



	socket.on('resetAll', function(){
		reset();
	});
	document.getElementById('anotherRound').onclick     = function(){
		socket.emit('reset');
	}


})(this);

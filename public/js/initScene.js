(function (exports){

	//UNIVERSAL VARIABLES
	var cubeSize               = 1;
	var disBetTandJ            = 10;
	var metaNormalSpeed        = 0.05;
	var normalSpeed            = 0.05;
	var jerrySpeed             = normalSpeed;//0.08
	var aPos;
	var shift                  = 0;//for tom and jerry to shift
	var keyboard               = new THREEx.KeyboardState();
	var groundWidth            = 20;
	var wallShift              = 0;
	var targetDistance         = 100;
	var distanceRemained       = targetDistance;
	var jerryMetaShift         = 5;
	var tomMetaShift           = 2;
	var hitScale               = 1.0;//when detecting catch
	var role                   = document.location.pathname.slice(1);
	var gameStop               = true;
	var tomReady               = false;
	var jerryReady             = false;
	var fpv                    = false;

	exports.cubeSize           = cubeSize;
	exports.disBetTandJ        = disBetTandJ;
	exports.metaNormalSpeed    = metaNormalSpeed;
	exports.normalSpeed        = normalSpeed;
	exports.jerrySpeed         = jerrySpeed;//0.08
	exports.aPos               = aPos;
	exports.shift              = shift;
	exports.keyboard           = keyboard;
	exports.groundWidth        = groundWidth;
	exports.wallShift          = wallShift;
	exports.targetDistance     = targetDistance;
	exports.distanceRemained   = distanceRemained;
	exports.jerryMetaShift     = jerryMetaShift;
	exports.tomMetaShift       = tomMetaShift;
	exports.hitScale           = hitScale;
	exports.role               = role;
	exports.gameStop           = gameStop;
	exports.tomReady           = tomReady;
	exports.jerryReady         = jerryReady;
	exports.fpv                = fpv;

	//SOCKET
	var socket                 = io.connect('http://' + location.host);

	//CAMERA TRACKER
	var ctracker               = new clm.tracker({useWebGL : true});
	ctracker.init(pModel);
	var vid                    = document.getElementsByTagName('video')[0];
	ctracker.start(vid);

	var faceDetection          = function(){
		var positions             = ctracker.getCurrentPosition();
		exports.aPos              = positions[33];
	}




	//SCENE
	var scene                  = new THREE.Scene();
	//			scene.fog             = new THREE.Fog( 0xffffff, 1000, 10000 );//////////////////

	scene.fog                  = new THREE.Fog( 0xffffff, 1, 5000 );
	scene.fog.color.setHSL( 0.6, 0, 1 );

	// LIGHTS

	hemiLight                  = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
	hemiLight.color.setHSL( 0.6, 1, 0.6 );
	hemiLight.color.setHSL( 0.6, 1, 0.95 );

	hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
	hemiLight.position.set( 0, 500, 0 );
	scene.add( hemiLight );

	//CAMERA

	var camera                 = new THREE.PerspectiveCamera( 90, window.innerWidth/window.innerHeight, 0.1, 1000 );

	if (role == "jerry"){
		camera.rotation.y         = 180 * Math.PI / 180;
	}


	//CONTROLS
	// var controls            = new THREE.OrbitControls( camera );
	// controls.addEventListener( 'change', render );



	// GROUND
	var groundGeo              = new THREE.PlaneBufferGeometry( 10000, 10000 );
	var groundMat              = new THREE.MeshPhongMaterial( { ambient: 0xffffff, color: 0xffffff, specular: 0x050505 } );
	groundMat.color.setHSL( 0.095, 1, 0.75 );
	var ground                 = new THREE.Mesh( groundGeo, groundMat );
	ground.rotation.x          = -Math.PI/2;
	ground.position.y          = -3;
	scene.add( ground );

	ground.receiveShadow       = true;

	// RIGHT WALL
	var rightWallGeo           = new THREE.PlaneBufferGeometry( 10000, 10000 );
	var rightWallMat           = new THREE.MeshPhongMaterial( { ambient: 0xffffff, color: 0xffffff, specular: 0x050505 } );
	rightWallMat.color.setHSL( 0.05, 1, 0.2 );
	var rightWall              = new THREE.Mesh( rightWallGeo, rightWallMat );
	rightWall.rotation.y       = - Math.PI/2
	rightWall.position.x       = groundWidth/2 + cubeSize/2 + wallShift;
	scene.add( rightWall );

	rightWall.receiveShadow    = true;

	// LEFT WALL
	var leftWallGeo            = new THREE.PlaneBufferGeometry( 10000, 10000 );
	var leftWallMat            = new THREE.MeshPhongMaterial( { ambient: 0xffffff, color: 0xffffff, specular: 0x050505 } );
	leftWallMat.color.setHSL( 0.05, 1, 0.2 );
	var leftWall               = new THREE.Mesh( leftWallGeo, leftWallMat );
	leftWall.rotation.y        = Math.PI/2
	leftWall.position.x        = -groundWidth/2 - cubeSize/2- wallShift;
	scene.add( leftWall );

	leftWall.receiveShadow     = true;

	// //Cube0

	// var geometry            = new THREE.BoxGeometry( 1, 1, 1 );
	// var material            = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
	// var cube0               = new THREE.Mesh( geometry, material );
	// scene.add( cube0 );
	// cube0.position.z        = -100;

	//Cube1 - Jerry

	var geometry               = new THREE.BoxGeometry( cubeSize, cubeSize, cubeSize );
	var material               = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
	var jerry                  = new THREE.Mesh( geometry, material );
	jerry.castShadow           = true;
	jerry.receiveShadow        = false;
	scene.add( jerry );

	//Cube2 - Tom

	var geometry               = new THREE.BoxGeometry( cubeSize, cubeSize, cubeSize);
	var material               = new THREE.MeshBasicMaterial( { color: 0x0000ff } );
	var tom                    = new THREE.Mesh( geometry, material );
	tom.castShadow             = true;
	tom.receiveShadow          = false;
	scene.add( tom );
	tom.position.z             = disBetTandJ;

	//Cube3	- Food

	var foodGeometry           = new THREE.BoxGeometry( cubeSize*5, cubeSize*5, cubeSize*5 );
	var foodMaterial           = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
	var food                   = new THREE.Mesh( foodGeometry, foodMaterial );
	food.position.z            = targetDistance;
	scene.add( food );



	//RENDERER
	var renderer               = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.shadowMapEnabled  = true;
	renderer.shadowMapType     = THREE.PCFSoftShadowMap;
	renderer.shadowMapCullFace = THREE.CullFaceBack;
	document.body.appendChild( renderer.domElement );

	exports.socket             = socket;
	exports.ctracker           = ctracker;
	exports.scene              = scene;
	exports.camera             = camera;
	// exports.cube0           = cube0;
	exports.jerry              = jerry;
	exports.tom                = tom;
	exports.food               = food;
	exports.renderer           = renderer;
	exports.faceDetection      = faceDetection;

})(this);


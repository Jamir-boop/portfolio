import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
// import * as DAT from 'https://cdnjs.cloudflare.com/ajax/libs/dat-gui/0.7.7/dat.gui.js';

import { FBXLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';

// Scene + Camera + Renderer
const scene = new THREE.Scene();
let camera, renderer, controls, importedModule;
let isMobile;
// const gui = new DAT.GUI();

/**
  * Init basic 3D Scene Elements
  */
let init = () => {

	// Checks if app is running on a mobile device
	isMobile = false;
	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
		isMobile = true;
	}

	let SCREEN_WIDTH = window.innerWidth,
	SCREEN_HEIGHT = window.innerHeight,
	VIEW_ANGLE = 45,
	ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT,
	NEAR = 0.1,
	FAR = 20000;

	camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
	// camera = new THREE.OrthographicCamera( SCREEN_WIDTH, SCREEN_WIDTH, SCREEN_HEIGHT, SCREEN_HEIGHT, NEAR, 1000 );
	// camera.position.set(0, 0, 1);
	camera.position.set(20, 0, 30);
	// camera.rotation.set(0, 0, 180);
	scene.add(camera);

	//LUCES
	var ambientLight = new THREE.AmbientLight ( 0xffffff, 1)
	scene.add( ambientLight )

	var pointLight = new THREE.PointLight( 0xFF001E, 1 )
	pointLight.position.set( 0, 0, 0.7 )
	scene.add( pointLight )
	var helper = new THREE.PointLightHelper(pointLight);
	pointLight.add(helper);

	renderer = new THREE.WebGLRenderer({ 
		antialias: true, 
		alpha: true, 
		canvas: home__scene 
	});
	renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    // renderer.physicallyCorrectLights = true;
    // renderer.toneMapping = THREE.ACESFilmicToneMapping;
    // renderer.outputEncoding = THREE.sRGBEncoding;
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
    controls = new OrbitControls( camera, renderer.domElement );
	window.addEventListener( 'resize', onWindowResize, false );

	if(isMobile){
		camera.position.set(0, 0, 0);
	    camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( window.innerWidth, window.innerHeight );
	}

    // animate();
    tick();
}

// 	TEXTURE LOADERS
const texture_loader = new THREE.TextureLoader();
const texture = texture_loader.load('assets/image/texture/base.jpg');
const height = texture_loader.load('assets/image/texture/height2.png');
const normal = texture_loader.load('assets/image/texture/height2.png');

// TUNNEL
const geometry = new THREE.PlaneGeometry( 20, 40 );
const material = new THREE.MeshStandardMaterial( {
	color: 0x8F72F7,
	// color: 'gray',
	// side: THREE.DoubleSide,
	// map: texture,
	displacementMap: height,
	displacementScale: .8,
	normalMap: normal,
} );
// material.normalScale.set(10, 5)

const plane = new THREE.Mesh( geometry, material );
const plane2 = new THREE.Mesh( geometry, material );
scene.add( plane, plane2 );
// scene.add( plane2 );
plane.position.set(0, 0, 0)
plane2.rotation.x = -30;
plane.rotation.x = 29.90;

/**
 * Updates objects on each frame
 */
let animate = () => {
	requestAnimationFrame( animate );
	// cube.rotation.x += 0.03;
	// plane.rotation.z += 0.1;
	// pointLight.position.z += 0.1;

	controls.update();
	renderer.render( scene, camera );
}

const clock = new THREE.Clock();
const tick = () => {
	// const elapsedTime = clock.getElapsedTime();	
	renderer.render( scene, camera );
	window.requestAnimationFrame( tick );
}
/**
  * Handles window resize events
  */
let onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

	renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
}

init();
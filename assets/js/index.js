import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
// import * as dat from 'https://cdnjs.cloudflare.com/ajax/libs/dat-gui/0.7.7/dat.gui.js';

import {FBXLoader} from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/FBXLoader.js';
import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/GLTFLoader.js';
import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';
// Scene + Camera + Renderer
const scene = new THREE.Scene();
let camera, renderer, controls, importedModule;
let isMobile;

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
	camera.position.set(0, 0, 10);
	scene.add(camera);

	//LUCES
	var ambientLight = new THREE.AmbientLight ( 0xffffff, 2)
	scene.add( ambientLight )

	var pointLight = new THREE.PointLight( 0xFF001E, 0.2 )
	pointLight.position.set( 0, 0, 10 )
	scene.add( pointLight )

	renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, canvas: home__scene });
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
    controls = new OrbitControls( camera, renderer.domElement );
	window.addEventListener( 'resize', onWindowResize, false );

	if(isMobile){
		camera.position.set(0, 0, 3);
	    camera.aspect = 1;
		camera.updateProjectionMatrix();
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( window.innerWidth, window.innerHeight );
	}

    animate();
}

// basic cube
// var geometry = new THREE.BoxGeometry( 1, 1, 1 )
// var material = new THREE.MeshStandardMaterial( { color: 0x8F72F7 })
// var cube = new THREE.Mesh ( geometry, material )
// scene.add( cube )

// TUNNEL
const geometry = new THREE.PlaneGeometry( 1, 1 );
const material = new THREE.MeshBasicMaterial( {color: 0x8F72F7, side: THREE.DoubleSide} );
const plane = new THREE.Mesh( geometry, material );
scene.add( plane );

/**
 * Updates objects on each frame
 */
let animate = () => {
	requestAnimationFrame( animate );
	// cube.rotation.x += 0.03;
	plane.rotation.y += 0.01;

	controls.update();
	renderer.render( scene, camera );
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
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js";
// import * as DAT from 'https://cdnjs.cloudflare.com/ajax/libs/dat-gui/0.7.7/dat.gui.js';

// import { FBXLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/FBXLoader.js';
// import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js";
import { RectAreaLightUniformsLib } from "https://cdn.jsdelivr.net/npm/three@0.122/examples/jsm/lights/RectAreaLightUniformsLib.js";
import { RectAreaLightHelper } from "https://cdn.jsdelivr.net/npm/three@0.122/examples/jsm/helpers/RectAreaLightHelper.js";
// import * as dat from 'https://cdn.jsdelivr.net/npm/dat.gui@0.7.7/build/dat.gui.min.js';
// import * as dat from 'https://cdnjs.cloudflare.com/ajax/libs/dat-gui/0.7.7/dat.gui.js';

import { EffectComposer } from "https://cdn.jsdelivr.net/npm/three@0.122/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "https://cdn.jsdelivr.net/npm/three@0.122/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "https://cdn.jsdelivr.net/npm/three@0.122/examples/jsm/postprocessing/UnrealBloomPass.js";
// import {GlitchPass} from 'https://cdn.jsdelivr.net/npm/three@0.122/examples/jsm/postprocessing/GlitchPass.js';
// import {ShaderPass} from 'https://cdn.jsdelivr.net/npm/three@0.122/examples/jsm/postprocessing/ShaderPass.js';
// import {SSAOPass} from 'https://cdn.jsdelivr.net/npm/three@0.122/examples/jsm/postprocessing/SSAOPass.js';

// import {LuminosityShader} from 'https://cdn.jsdelivr.net/npm/three@0.122/examples/jsm/shaders/LuminosityShader.js';

/*
	Scene + Camera + Renderer
*/
const scene = new THREE.Scene();
let camera, renderer, controls, importedModule, composer;
let isMobile;
// const gui = new dat.GUI();

/**
 * Init basic 3D Scene Elements
 */
let init = () => {
	// Checks if app is running on a mobile device
	isMobile = false;
	if (
		/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
			navigator.userAgent
		)
	) {
		isMobile = true;
	}

	let SCREEN_WIDTH = window.innerWidth,
		SCREEN_HEIGHT = window.innerHeight,
		VIEW_ANGLE = 45,
		ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT,
		NEAR = 0.1,
		FAR = 20000;

	camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
	// camera = new THREE.OrthographicCamera( SCREEN_WIDTH, SCREEN_WIDTH, SCREEN_HEIGHT, SCREEN_HEIGHT, NEAR, 1000 );
	// camera.position.set( 0, 0, 1 );
	camera.position.set(0, 0, 30);
	// camera.rotation.set(180, 0, 0);
	scene.add(camera);

	// Axes Helper
	const axesHelper = new THREE.AxesHelper(3);
	scene.add(axesHelper);

	// SPACE TEXTURE scene background
	// const spaceTexture = new THREE.TextureLoader().load('assets/image/texture/space.jpg');
	// scene.background = spaceTexture;

	/*
		LIGHTs
	*/
	// var ambientLight = new THREE.AmbientLight( 0xffffff, 1)
	// scene.add( ambientLight )
	// AREA LIGHT
	const directionalLight = new THREE.DirectionalLight(0xff001e, 0.2);
	directionalLight.rotation.z = 10;
	scene.add(directionalLight);
	const helperDirectional = new THREE.DirectionalLightHelper(
		directionalLight
	);
	scene.add(helperDirectional);

	const hemisphereLigth = new THREE.HemisphereLight(0xffffff, 0x5f4ca4, 0.7);
	scene.add(hemisphereLigth);

	// AREA LIGHT
	const area_width = 1.0,
		area_height = 10.0;
	RectAreaLightUniformsLib.init();
	const areaLigth = new THREE.RectAreaLight(
		0xffffff,
		0.8,
		area_width,
		area_height
	);
	areaLigth.position.set(0, 0, 0);
	areaLigth.lookAt(0, 0, 1);
	scene.add(areaLigth);
	const rectLightHelper = new RectAreaLightHelper(areaLigth);
	areaLigth.add(rectLightHelper);

	// POINT LIGHT
	const pointLight = new THREE.PointLight(0xff001e, 1);
	pointLight.position.set(0, 0, 0);
	scene.add(pointLight);
	const helperPoint = new THREE.PointLightHelper(pointLight);
	pointLight.add(helperPoint);

	/*
		RENDER & POST PROCESING
	*/
	renderer = new THREE.WebGLRenderer({
		// antialias: true,
		alpha: true,
		canvas: home__scene,
	});
	composer = new EffectComposer(renderer);
	composer.addPass(new RenderPass(scene, camera));
	composer.setSize(window.innerWidth, window.innerHeight);
	composer.addPass(
		new UnrealBloomPass(
			{ x: window.innerWidth, y: window.innerHeight },
			2.0,
			0.4,
			0.375
		)
	);
	// composer.addPass( new GlitchPass() );

	renderer.shadowMap.enabled = true;
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);
	controls = new OrbitControls(camera, renderer.domElement);
	window.addEventListener("resize", onWindowResize, false);

	if (isMobile) {
		camera.position.set(0, 0, 0);
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(window.innerWidth, window.innerHeight);
	}

	tick();
};

/*
 	TEXTURE LOADERS
*/
const texture_loader = new THREE.TextureLoader();
const texture = texture_loader.load("assets/image/texture/base.jpg");
const height = texture_loader.load("assets/image/texture/height2.png");
const normal = texture_loader.load("assets/image/texture/normal.jpg");
const alpha = texture_loader.load("assets/image/texture/alpha.png");

/*
	TUNNEL PLANES
*/
const geometry = new THREE.PlaneBufferGeometry(60, 80, 100, 100);
const material = new THREE.MeshStandardMaterial({
	color: 0x5f4ca4,
	// color: 'gray',
	side: THREE.DoubleSide,
	// map: texture,
	displacementMap: height,
	displacementScale: 20,
	normalMap: normal,
	alphaMap: alpha,
	transparent: true,
	// depthTest: false,
	roughness: 0.001,
	metalness: 0.4,
	flatShading: true,
});

const plane = new THREE.Mesh(geometry, material);
const plane2 = new THREE.Mesh(geometry, material);
scene.add(plane, plane2);
plane.position.set(0, -4, 0);
plane2.position.set(0, 4, 0);

plane2.rotation.x = -30;
plane2.rotation.z = 180;
plane.rotation.x = 29.9;

/**
 * Particles
 */
function addStar() {
	const star_geometry = new THREE.SphereGeometry(0.2, 20, 20);
	const star_material = new THREE.MeshStandardMaterial({ color: 0xffffff });
	const star = new THREE.Mesh(star_geometry, star_material);

	const [x, y, z] = Array(3)
		.fill()
		.map(() => THREE.MathUtils.randFloatSpread(100));

	star.position.set(x, y, z);
	scene.add(star);
}
Array(300).fill().forEach(addStar);

/**
 * Updates objects on each frame
 */
const clock = new THREE.Clock();
let tick = () => {
	// const elapsedTime = clock.getElapsedTime();
	if (material.displacementScale <= 30) {
		material.displacementScale += 0.01;
	} else {
		material.displacementScale = 20;
	}
	// camera.position.z += 0.1;
	// console.log(camera.position.z);
	// renderer.render( scene, camera );
	composer.render();
	window.requestAnimationFrame(tick);
};

/**
 * Handles window resize events
 */
let onWindowResize = () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	composer.setSize(window.innerWidth, window.innerHeight);
};

init();

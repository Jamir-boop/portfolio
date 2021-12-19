import * as THREE from "three";
import { GUI } from "dat.gui";

// import { FBXLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/FBXLoader.js';
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
// import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { GlitchPass } from "three/examples/jsm/postprocessing/GlitchPass.js";
// import {ShaderPass} from "three/examples/jsm/postprocessing/ShaderPass.js";
// import {SSAOPass} from "three/examples/jsm/postprocessing/SSAOPass.js";

// import {LuminosityShader} from "three/examples/jsm/shaders/LuminosityShader.js";

window.addEventListener("load", init, false);

/*
	Init function
*/
function init() {
	checkMobile();
	createScene();
	createLighting();
	loadObjects();
	// createPrimitive();
	createGUI();
	tick();
}

/*
	Global Variables
	Scene + Camera + Renderer
*/
const scene = new THREE.Scene();
let camera, renderer, controls, importedModule, composer;
let start = Date.now();
let gui = new GUI();
let isMobile;
let _width, _height;
let material;

// Checks if app is running on a mobile device
function checkMobile() {
	isMobile = false;
	if (
		/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
			navigator.userAgent
		)
	) {
		isMobile = true;
	}
}

function createScene() {
	_width = window.innerWidth;
	_height = window.innerHeight;

	let SCREEN_WIDTH = _width,
		SCREEN_HEIGHT = _height,
		VIEW_ANGLE = 45,
		ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT,
		NEAR = 0.1,
		FAR = 2000;

	camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
	// camera = new THREE.OrthographicCamera( SCREEN_WIDTH, SCREEN_WIDTH, SCREEN_HEIGHT, SCREEN_HEIGHT, NEAR, 1000 );
	camera.position.set(0, 0, 1);
	// camera.position.set(0, 0, 30);
	scene.add(camera);

	// Axes Helper
	const axesHelper = new THREE.AxesHelper(3);
	scene.add(axesHelper);

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
	composer.addPass(new GlitchPass(64));

	renderer.shadowMap.enabled = true;
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);
	controls = new OrbitControls(camera, renderer.domElement);

	if (isMobile) {
		camera.position.set(0, 0, 0);
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(window.innerWidth, window.innerHeight);
	}

	window.addEventListener("resize", onWindowResize, false);
}

function createLighting() {
	// var ambientLight = new THREE.AmbientLight( 0xffffff, 1)
	// scene.add( ambientLight )

	// DIRECITONAL LIGHT
	const directionalLight = new THREE.DirectionalLight(0xff001e, 0.2);
	directionalLight.rotation.z = 10;
	scene.add(directionalLight);
	const helperDirectional = new THREE.DirectionalLightHelper(
		directionalLight
	);
	scene.add(helperDirectional);

	// HEMISPHERE LIGHT
	const hemisphereLigth = new THREE.HemisphereLight(0xffffff, 0x5f4ca4, 0.7);
	scene.add(hemisphereLigth);

	// AREA LIGHT
	const area_width = 0.6,
		area_height = 5.0;
	RectAreaLightUniformsLib.init();
	const areaLigth = new THREE.RectAreaLight(
		0xffffff,
		0.8,
		area_width,
		area_height
	);
	areaLigth.position.set(0, 0, -10);
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
}

function loadObjects() {
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
	material = new THREE.MeshStandardMaterial({
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

	const objLoader = new OBJLoader();
	objLoader.load("assets/models/untitled.obj", (obj) => {
		obj.scale.set(0.1, 0.1, 0.1);
		obj.position.set(-0.3, -0.206, 0);

		const material_statue = new THREE.MeshStandardMaterial({
			color: 0xffffff,
			roughness: 0.001,
			metalness: 0.4,
			flatShading: true,
		});
		obj.traverse((c) => {
			c.castShadow = true;
			c.material = material_statue;
		});

		scene.add(obj);
	});
}

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
function tick() {
	// const elapsedTime = clock.getElapsedTime();
	if (material.displacementScale <= 30) {
		material.displacementScale += 0.01;
	} else {
		material.displacementScale = 20;
	}

	// obj.rotiation.z += 0.01;

	// renderer.render( scene, camera );
	composer.render();
	window.requestAnimationFrame(tick);
}

/**
 * Updates camera on scroll
 */
function updateCamera() {
	camera.position.z = 10 + window.scrollY / 300.0;
}

/**
 * Handles window resize events
 */
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	composer.setSize(window.innerWidth, window.innerHeight);
}

/**
 * Updates objects on each frame
 */
function createGUI() {
	const cameraFolder = gui.addFolder("Camera");
	cameraFolder.add(camera.position, "x", 0, 60).step(0.001);
	cameraFolder.add(camera.position, "y", 0, 60).step(0.001);
	cameraFolder.add(camera.position, "z", 0, 60).step(0.001);
	cameraFolder.open();
}